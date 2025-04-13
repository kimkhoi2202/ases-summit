import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Spinner,
  Chip,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Divider
} from "@heroui/react";
import { supabase, Contact } from "../lib/supabase";
import { Icon } from "@iconify/react";
import { formatPhoneNumber } from "../utils/phone-formatter";

export const NetworkApproval: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Filter state: 'pending', 'approved', or 'rejected'
  const [filterState, setFilterState] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching contacts with filter state:', filterState);

      // We know the is_rejected column exists now, so we don't need to check
      console.log('Using is_rejected column for filtering');

      // Fetch from Supabase based on the filter
      let query = supabase
        .from('contacts')
        .select('*');

      if (filterState === 'pending') {
        query = query
          .eq('is_approved', false)
          .eq('is_rejected', false);
      } else if (filterState === 'approved') {
        query = query.eq('is_approved', true);
      } else if (filterState === 'rejected') {
        query = query.eq('is_rejected', true);
      }

      // Order by most recent first
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setContacts(data || []);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Failed to load submissions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [filterState]);

  const handleApprove = async (id: string) => {
    try {
      setProcessingId(id);

      // Update in Supabase
      const { error } = await supabase
        .from('contacts')
        .update({ is_approved: true })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setContacts(prevContacts =>
        prevContacts.map(contact =>
          contact.id === id ? { ...contact, is_approved: true } : contact
        )
      );
    } catch (err) {
      console.error('Error approving contact:', err);
      setError('Failed to approve submission. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setProcessingId(id);

      let error = null;
      const hasRejectedColumn = true;

      if (hasRejectedColumn) {
        // If column exists, update the is_rejected field and ensure is_approved is false
        console.log('Updating contact with is_rejected=true and is_approved=false');
        const result = await supabase
          .from('contacts')
          .update({ is_rejected: true, is_approved: false })
          .eq('id', id);

        error = result.error;
      } else {
        // If column doesn't exist, delete the contact
        console.log('is_rejected column does not exist, deleting contact instead');
        const result = await supabase
          .from('contacts')
          .delete()
          .eq('id', id);

        error = result.error;
      }

      if (error) {
        throw error;
      }

      // Update local state
      if (filterState === 'pending') {
        // If we're in pending view, remove the contact from the list
        setContacts(prevContacts =>
          prevContacts.filter(contact => contact.id !== id)
        );
      } else {
        // Otherwise, update the contact's status
        setContacts(prevContacts =>
          prevContacts.map(contact =>
            contact.id === id ? { ...contact, is_rejected: true, is_approved: false } : contact
          )
        );
      }
    } catch (err) {
      console.error('Error rejecting contact:', err);
      setError('Failed to reject submission. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleViewDetails = (contact: Contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Network Submissions</h1>
        <div className="flex gap-2">
          <Button
            color={filterState === 'pending' ? 'primary' : 'default'}
            variant={filterState === 'pending' ? 'solid' : 'bordered'}
            onPress={() => setFilterState('pending')}
            size="sm"
          >
            Show Pending
          </Button>
          <Button
            color={filterState === 'approved' ? 'success' : 'default'}
            variant={filterState === 'approved' ? 'solid' : 'bordered'}
            onPress={() => setFilterState('approved')}
            size="sm"
          >
            Show Approved
          </Button>
          <Button
            color={filterState === 'rejected' ? 'danger' : 'default'}
            variant={filterState === 'rejected' ? 'solid' : 'bordered'}
            onPress={() => setFilterState('rejected')}
            size="sm"
          >
            Show Rejected
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 text-center text-red-600 border border-red-300 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spinner size="lg" color="primary" />
        </div>
      ) : contacts.length === 0 ? (
        <div className="p-8 text-center text-gray-500 border border-gray-200 rounded-lg">
          <p>No network submissions found.</p>
        </div>
      ) : (
        <Table aria-label="Network submissions">
          <TableHeader>
            <TableColumn>NAME</TableColumn>
            <TableColumn>CATEGORY</TableColumn>
            <TableColumn>TITLE</TableColumn>
            <TableColumn>LOCATION</TableColumn>
            <TableColumn>SUBMITTED</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>{contact.name}</TableCell>
                <TableCell>
                  <Chip
                    color={
                      contact.category === 'organizer' ? 'primary' :
                      contact.category === 'speaker' ? 'success' :
                      'warning'
                    }
                    variant="flat"
                    size="sm"
                  >
                    {contact.category.charAt(0).toUpperCase() + contact.category.slice(1)}
                  </Chip>
                </TableCell>
                <TableCell>{contact.title}</TableCell>
                <TableCell>{contact.location || '-'}</TableCell>
                <TableCell>
                  {new Date(contact.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip
                    color={contact.is_approved ? 'success' : contact.is_rejected === true ? 'danger' : 'warning'}
                    variant="flat"
                    size="sm"
                  >
                    {contact.is_approved ? 'Approved' : contact.is_rejected === true ? 'Rejected' : 'Pending'}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Tooltip content="View Details">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => handleViewDetails(contact)}
                      >
                        <Icon icon="mdi:eye" className="text-lg" />
                      </Button>
                    </Tooltip>

                    {!contact.is_approved && contact.is_rejected !== true && (
                      <>
                        <Tooltip content="Approve">
                          <Button
                            isIconOnly
                            size="sm"
                            color="success"
                            variant="flat"
                            isLoading={processingId === contact.id}
                            onPress={() => handleApprove(contact.id)}
                          >
                            <Icon icon="mdi:check" className="text-lg" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Reject">
                          <Button
                            isIconOnly
                            size="sm"
                            color="danger"
                            variant="flat"
                            isLoading={processingId === contact.id}
                            onPress={() => handleReject(contact.id)}
                          >
                            <Icon icon="mdi:close" className="text-lg" />
                          </Button>
                        </Tooltip>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Contact Details Modal */}
      <Modal isOpen={isModalOpen} onOpenChange={closeModal} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Network Details
              </ModalHeader>
              <ModalBody>
                {selectedContact && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      {selectedContact.photo_url && (
                        <div className="aspect-square overflow-hidden rounded-lg mb-4">
                          <img
                            src={selectedContact.photo_url}
                            alt={selectedContact.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://placehold.co/400x400/6abcff/ffffff?text=Error";
                            }}
                          />
                        </div>
                      )}
                      <h2 className="text-2xl font-bold">{selectedContact.name}</h2>
                      <div className="flex items-center gap-2 mt-1 mb-2">
                        <Chip
                          color="primary"
                          variant="flat"
                          size="sm"
                        >
                          {selectedContact.category.charAt(0).toUpperCase() + selectedContact.category.slice(1)}
                        </Chip>
                        <p className="text-gray-600">{selectedContact.title}</p>
                      </div>
                      {selectedContact.location && (
                        <p className="text-sm text-gray-500 mb-3">
                          <Icon icon="mdi:map-marker" className="inline-block mr-1" />
                          {selectedContact.location}
                        </p>
                      )}
                      {selectedContact.bio && (
                        <div className="mb-4">
                          <h3 className="text-md font-semibold mb-1">Bio</h3>
                          <p className="text-gray-700">{selectedContact.bio}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                      <div className="space-y-3">
                        {selectedContact.email && (
                          <div className="flex items-center gap-2">
                            <Icon icon="mdi:email" className="text-xl text-gray-600" />
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <a href={`mailto:${selectedContact.email}`} className="text-blue-600 hover:underline">
                                {selectedContact.email}
                              </a>
                            </div>
                          </div>
                        )}
                        {selectedContact.phone && (
                          <div className="flex items-center gap-2">
                            <Icon icon="mdi:phone" className="text-xl text-gray-600" />
                            <div>
                              <p className="text-sm text-gray-500">Phone</p>
                              <a href={`tel:${selectedContact.phone}`} className="text-blue-600 hover:underline">
                                {formatPhoneNumber(selectedContact.phone)}
                              </a>
                            </div>
                          </div>
                        )}
                        {selectedContact.website && (
                          <div className="flex items-center gap-2">
                            <Icon icon="mdi:web" className="text-xl text-gray-600" />
                            <div>
                              <p className="text-sm text-gray-500">Website</p>
                              <a href={selectedContact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {selectedContact.website}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>

                      {(selectedContact.instagram || selectedContact.facebook || selectedContact.linkedin ||
                        selectedContact.youtube || selectedContact.twitter) && (
                        <>
                          <Divider className="my-4" />
                          <h3 className="text-lg font-semibold mb-3">Social Media</h3>
                          <div className="space-y-3">
                            {selectedContact.instagram && (
                              <div className="flex items-center gap-2">
                                <Icon icon="mdi:instagram" className="text-xl text-gray-600" />
                                <div>
                                  <p className="text-sm text-gray-500">Instagram</p>
                                  <a href={selectedContact.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {selectedContact.instagram.replace(/https?:\/\/(www\.)?instagram\.com\//i, '@')}
                                  </a>
                                </div>
                              </div>
                            )}
                            {selectedContact.facebook && (
                              <div className="flex items-center gap-2">
                                <Icon icon="mdi:facebook" className="text-xl text-gray-600" />
                                <div>
                                  <p className="text-sm text-gray-500">Facebook</p>
                                  <a href={selectedContact.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {selectedContact.facebook.replace(/https?:\/\/(www\.)?facebook\.com\//i, '')}
                                  </a>
                                </div>
                              </div>
                            )}
                            {selectedContact.linkedin && (
                              <div className="flex items-center gap-2">
                                <Icon icon="mdi:linkedin" className="text-xl text-gray-600" />
                                <div>
                                  <p className="text-sm text-gray-500">LinkedIn</p>
                                  <a href={selectedContact.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {selectedContact.linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//i, '')}
                                  </a>
                                </div>
                              </div>
                            )}
                            {selectedContact.youtube && (
                              <div className="flex items-center gap-2">
                                <Icon icon="mdi:youtube" className="text-xl text-gray-600" />
                                <div>
                                  <p className="text-sm text-gray-500">YouTube</p>
                                  <a href={selectedContact.youtube} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {selectedContact.youtube.replace(/https?:\/\/(www\.)?youtube\.com\/(channel|user)\/|https?:\/\/(www\.)?youtube\.com\/@/i, '@')}
                                  </a>
                                </div>
                              </div>
                            )}
                            {selectedContact.twitter && (
                              <div className="flex items-center gap-2">
                                <Icon icon="mdi:twitter" className="text-xl text-gray-600" />
                                <div>
                                  <p className="text-sm text-gray-500">Twitter</p>
                                  <a href={selectedContact.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {selectedContact.twitter.replace(/https?:\/\/(www\.)?twitter\.com\//i, '@')}
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      {!selectedContact.email &&
                       !selectedContact.instagram &&
                       !selectedContact.facebook &&
                       !selectedContact.linkedin &&
                       !selectedContact.youtube &&
                       !selectedContact.twitter &&
                       !selectedContact.website &&
                       !selectedContact.phone && (
                        <p className="text-gray-500 italic">No contact information provided</p>
                      )}
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                {selectedContact && !selectedContact.is_approved && selectedContact.is_rejected !== true && (
                  <>
                    <Button
                      color="danger"
                      variant="flat"
                      onPress={() => {
                        handleReject(selectedContact.id);
                        onClose();
                      }}
                    >
                      Reject
                    </Button>
                    <Button
                      color="success"
                      onPress={() => {
                        handleApprove(selectedContact.id);
                        onClose();
                      }}
                    >
                      Approve
                    </Button>
                  </>
                )}
                <Button color="primary" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
