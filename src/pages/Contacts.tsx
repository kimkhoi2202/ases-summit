import React, { useEffect, useState } from "react";
import { Tabs, Tab, Card, CardBody, Button, Spinner, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Chip, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Hero } from "../components/hero";
import { supabase, Contact } from "../lib/supabase";
import { Link as RouterLink } from "react-router-dom";
import { formatPhoneNumber } from "../utils/phone-formatter";

interface ContactCardProps extends Contact {
  onViewDetails: (contact: Contact) => void;
}

const ContactCard: React.FC<ContactCardProps> = (props) => {
  const {
    photo_url,
    name,
    title,
    bio,
    location,
    instagram,
    facebook,
    linkedin,
    youtube,
    email,
    website,
    twitter,
    phone,
    onViewDetails
  } = props;

  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on a social media link
    if ((e.target as HTMLElement).closest('a')) {
      return;
    }
    onViewDetails(props);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={photo_url || "https://placehold.co/400x400/6abcff/ffffff?text=No+Photo"}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://placehold.co/400x400/6abcff/ffffff?text=Error";
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-xs text-gray-500 mb-2">
          <Icon icon="mdi:map-marker" className="inline-block mr-1" />
          {location}
        </p>
        <p className="text-sm text-gray-700 mb-4">{bio}</p>

        <div className="flex flex-wrap gap-2">
          {instagram && (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:opacity-90 transition-opacity"
              aria-label="Instagram"
            >
              <Icon icon="mdi:instagram" className="text-xl" />
            </a>
          )}

          {facebook && (
            <a
              href={facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-blue-600 text-white rounded-full hover:opacity-90 transition-opacity"
              aria-label="Facebook"
            >
              <Icon icon="mdi:facebook" className="text-xl" />
            </a>
          )}

          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-blue-700 text-white rounded-full hover:opacity-90 transition-opacity"
              aria-label="LinkedIn"
            >
              <Icon icon="mdi:linkedin" className="text-xl" />
            </a>
          )}

          {youtube && (
            <a
              href={youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-red-600 text-white rounded-full hover:opacity-90 transition-opacity"
              aria-label="YouTube"
            >
              <Icon icon="mdi:youtube" className="text-xl" />
            </a>
          )}

          {twitter && (
            <a
              href={twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-blue-400 text-white rounded-full hover:opacity-90 transition-opacity"
              aria-label="Twitter"
            >
              <Icon icon="mdi:twitter" className="text-xl" />
            </a>
          )}

          {email && (
            <a
              href={`mailto:${email}`}
              className="p-2 bg-gray-600 text-white rounded-full hover:opacity-90 transition-opacity"
              aria-label="Email"
            >
              <Icon icon="mdi:email" className="text-xl" />
            </a>
          )}

          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-green-600 text-white rounded-full hover:opacity-90 transition-opacity"
              aria-label="Website"
            >
              <Icon icon="mdi:web" className="text-xl" />
            </a>
          )}

          {phone && (
            <a
              href={`tel:${phone}`}
              className="p-2 bg-teal-600 text-white rounded-full hover:opacity-90 transition-opacity"
              aria-label="Phone"
            >
              <Icon icon="mdi:phone" className="text-xl" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};



export const Contacts: React.FC = () => {
  const [selected, setSelected] = useState("organizers");
  const [organizers, setOrganizers] = useState<Contact[]>([]);
  const [speakers, setSpeakers] = useState<Contact[]>([]);
  const [delegates, setDelegates] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTabChange = (key: string | number) => {
    setSelected(key.toString());
  };

  const handleViewDetails = (contact: Contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
  };

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch approved contacts from Supabase
        const { data, error } = await supabase
          .from('contacts')
          .select('*')
          .eq('is_approved', true);

        if (error) {
          throw error;
        }

        // Sort contacts by category
        const organizerContacts = data?.filter(contact => contact.category === 'organizer') || [];
        const speakerContacts = data?.filter(contact => contact.category === 'speaker') || [];
        const delegateContacts = data?.filter(contact => contact.category === 'delegate') || [];

        setOrganizers(organizerContacts);
        setSpeakers(speakerContacts);
        setDelegates(delegateContacts);
      } catch (err) {
        console.error('Error fetching contacts:', err);
        setError('Failed to load contacts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  return (
    <>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Card className="shadow-none">
          <CardBody className="p-0">
            <Tabs
              aria-label="ASES Summit Contacts"
              selectedKey={selected}
              onSelectionChange={handleTabChange}
              variant="underlined"
              color="primary"
              className="w-full"
            >
              <Tab key="organizers" title="Organizers">
                <div className="p-4">
                  {loading ? (
                    <div className="flex justify-center items-center h-40">
                      <Spinner size="lg" color="primary" />
                    </div>
                  ) : error ? (
                    <div className="p-4 text-center text-red-600">{error}</div>
                  ) : organizers.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <p>No organizers found.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {organizers.map((organizer) => (
                        <ContactCard
                          key={organizer.id}
                          {...organizer}
                          onViewDetails={handleViewDetails}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </Tab>
              <Tab key="speakers" title="Speakers">
                <div className="p-4">
                  {loading ? (
                    <div className="flex justify-center items-center h-40">
                      <Spinner size="lg" color="primary" />
                    </div>
                  ) : error ? (
                    <div className="p-4 text-center text-red-600">{error}</div>
                  ) : speakers.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <p>No speakers found.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {speakers.map((speaker) => (
                        <ContactCard
                          key={speaker.id}
                          {...speaker}
                          onViewDetails={handleViewDetails}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </Tab>
              <Tab key="delegates" title="Delegates">
                <div className="p-4">
                  {loading ? (
                    <div className="flex justify-center items-center h-40">
                      <Spinner size="lg" color="primary" />
                    </div>
                  ) : error ? (
                    <div className="p-4 text-center text-red-600">{error}</div>
                  ) : delegates.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <p>No delegates found.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {delegates.map((delegate) => (
                        <ContactCard
                          key={delegate.id}
                          {...delegate}
                          onViewDetails={handleViewDetails}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>

        <div className="mt-8 text-center">
          <Button
            as={RouterLink}
            to="/submit-contact"
            color="primary"
            size="lg"
            className="px-8"
          >
            Submit Your Contact Information
          </Button>
          <p className="mt-2 text-sm text-gray-500">
            If you went to ASES Summit and want to be featured on this page, submit your information for review.
          </p>
        </div>
      </div>

      {/* Contact Details Modal */}
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
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
