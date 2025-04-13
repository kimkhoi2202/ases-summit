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

export const ContactApproval: React.FC = () => {
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
      const hasRejectedColumn = true;
      console.log('Using is_rejected column for filtering');

      // Fetch from Supabase based on the filter
      let query = supabase
        .from('contacts')
        .select('*');

      // Apply filter based on the current state
      switch (filterState) {
        case 'approved':
          // For approved contacts, only show where is_approved is true
          query = query.eq('is_approved', true);
          break;
        case 'rejected':
          if (hasRejectedColumn) {
            // For rejected contacts, only show where is_rejected is true
            query = query.eq('is_rejected', true);
          } else {
            // If column doesn't exist, return empty result set
            console.log('is_rejected column does not exist, returning empty set for rejected filter');
            // Use a non-existent ID to ensure empty result
            query = query.eq('id', '00000000-0000-0000-0000-000000000000');
          }
          break;
        case 'pending':
        default:
          // For pending, show where is_approved is false
          query = query.eq('is_approved', false);
          if (hasRejectedColumn) {
            // Only filter by is_rejected if the column exists
            query = query.eq('is_rejected', false);
          }
          break;
      }

      // Order by creation date
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      console.log('Fetched contacts:', data ? data.length : 0, 'Error:', error);

      if (error) {
        throw error;
      }

      setContacts(data || []);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Failed to load contacts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [filterState]); // Refetch when the filter changes

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
      setError('Failed to approve contact. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setProcessingId(id);

      // We know the is_rejected column exists now, so we don't need to check
      const hasRejectedColumn = true;
      console.log('Using is_rejected column for rejection');

      let error;

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
      setError('Failed to reject contact. Please try again.');
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

  const renderSocialLinks = (contact: Contact) => {
    const links = [];

    if (contact.instagram) links.push('Instagram');
    if (contact.facebook) links.push('Facebook');
    if (contact.linkedin) links.push('LinkedIn');
    if (contact.youtube) links.push('YouTube');
    if (contact.twitter) links.push('Twitter');
    if (contact.email) links.push('Email');
    if (contact.website) links.push('Website');

    return links.length > 0 ? links.join(', ') : 'None';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>{error}</p>
        <Button
          color="primary"
          className="mt-4"
          onPress={fetchContacts}
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Set filter state directly
  const setFilter = (state: 'pending' | 'approved' | 'rejected') => {
    setFilterState(state);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-xl font-bold">
          {filterState === 'approved' ? 'Approved Contacts' :
           filterState === 'rejected' ? 'Rejected Contacts' :
           'Pending Approval'}
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button
            color={filterState === 'pending' ? "primary" : "default"}
            variant={filterState === 'pending' ? "solid" : "light"}
            size="sm"
            onPress={() => setFilter('pending')}
            startContent={<Icon icon="mdi:clock-outline" />}
          >
            Show Pending
          </Button>
          <Button
            color={filterState === 'approved' ? "success" : "default"}
            variant={filterState === 'approved' ? "solid" : "light"}
            size="sm"
            onPress={() => setFilter('approved')}
            startContent={<Icon icon="mdi:check-circle" />}
          >
            Show Approved
          </Button>
          <Button
            color={filterState === 'rejected' ? "danger" : "default"}
            variant={filterState === 'rejected' ? "solid" : "light"}
            size="sm"
            onPress={() => setFilter('rejected')}
            startContent={<Icon icon="mdi:close-circle" />}
          >
            Show Rejected
          </Button>
          <Button
            color="primary"
            size="sm"
            variant="light"
            onPress={fetchContacts}
            startContent={<Icon icon="mdi:refresh" />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className="p-8 text-center text-gray-500 border border-gray-200 rounded-lg">
          <p>No contact submissions found.</p>
        </div>
      ) : (
        <Table aria-label="Contact submissions">
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

      <Modal isOpen={isModalOpen} onOpenChange={closeModal} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Contact Details
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

                      <div className="space-y-2">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Category</h3>
                          <p className="font-semibold">
                            {selectedContact.category.charAt(0).toUpperCase() + selectedContact.category.slice(1)}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Status</h3>
                          <Chip
                            color={selectedContact.is_approved ? 'success' : selectedContact.is_rejected === true ? 'danger' : 'warning'}
                            variant="flat"
                            size="sm"
                          >
                            {selectedContact.is_approved ? 'Approved' : selectedContact.is_rejected === true ? 'Rejected' : 'Pending'}
                          </Chip>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Submitted</h3>
                          <p>{new Date(selectedContact.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Name</h3>
                        <p className="text-xl font-semibold">{selectedContact.name}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Title</h3>
                        <p>{selectedContact.title}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Location</h3>
                        <p>{selectedContact.location || 'Not specified'}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                        <p className="text-sm">{selectedContact.bio}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                        <div className="space-y-2 mt-2">
                          {selectedContact.email && (
                            <div className="flex items-center gap-2">
                              <Icon icon="mdi:email" className="text-gray-400" />
                              <a href={`mailto:${selectedContact.email}`} className="text-blue-600 hover:underline">
                                {selectedContact.email}
                              </a>
                            </div>
                          )}

                          {selectedContact.instagram && (
                            <div className="flex items-center gap-2">
                              <Icon icon="mdi:instagram" className="text-gray-400" />
                              <a href={selectedContact.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {selectedContact.instagram}
                              </a>
                            </div>
                          )}

                          {selectedContact.facebook && (
                            <div className="flex items-center gap-2">
                              <Icon icon="mdi:facebook" className="text-gray-400" />
                              <a href={selectedContact.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {selectedContact.facebook}
                              </a>
                            </div>
                          )}

                          {selectedContact.linkedin && (
                            <div className="flex items-center gap-2">
                              <Icon icon="mdi:linkedin" className="text-gray-400" />
                              <a href={selectedContact.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {selectedContact.linkedin}
                              </a>
                            </div>
                          )}

                          {selectedContact.youtube && (
                            <div className="flex items-center gap-2">
                              <Icon icon="mdi:youtube" className="text-gray-400" />
                              <a href={selectedContact.youtube} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {selectedContact.youtube}
                              </a>
                            </div>
                          )}

                          {selectedContact.twitter && (
                            <div className="flex items-center gap-2">
                              <Icon icon="mdi:twitter" className="text-gray-400" />
                              <a href={selectedContact.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {selectedContact.twitter}
                              </a>
                            </div>
                          )}

                          {selectedContact.website && (
                            <div className="flex items-center gap-2">
                              <Icon icon="mdi:web" className="text-gray-400" />
                              <a href={selectedContact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {selectedContact.website}
                              </a>
                            </div>
                          )}

                          {selectedContact.phone && (
                            <div className="flex items-center gap-2">
                              <Icon icon="mdi:phone" className="text-gray-400" />
                              <a href={`tel:${selectedContact.phone}`} className="text-blue-600 hover:underline">
                                {formatPhoneNumber(selectedContact.phone)}
                              </a>
                            </div>
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
