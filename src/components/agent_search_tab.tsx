import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Rows,
  SearchInputMenu,
  Menu,
  MenuItem,
  Button,
  Columns,
  Column,
  Text,
  ImageCard,
  LoadingIndicator,
  Pill,
  Box,
  Masonry,
  MasonryItem,
} from "@canva/app-ui-kit";
import { useAddElement } from "utils/use_add_element";
import { useSelection } from "utils/use_selection_hook";
import { useIntl } from "react-intl";
import { upload } from "@canva/asset";
import ApiClient from "../services/api_client";

interface AgentSearchResult {
  id: string;
  displayValue: string;
  email: string;
  data: Record<string, unknown>;
}

interface AgentProfileData {
  agent: Record<string, unknown>;
  images?: {
    url: string;
    field: string;
  }[];
  textFields?: {
    field: string;
    value: string;
  }[];
}

interface AgentSearchTabProps {
  userEmail?: string;
}

export const AgentSearchTab: React.FC<AgentSearchTabProps> = ({ userEmail }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AgentSearchResult[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentSearchResult | null>(null);
  const [agentProfile, setAgentProfile] = useState<AgentProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Image upload loading states
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(new Set());

  // Track if initial user profile has been loaded
  const hasLoadedInitialProfile = useRef(false);

  // Refs for managing search debouncing and cancellation
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentSearchController = useRef<AbortController | null>(null);

  const addElement = useAddElement();
  const textSelection = useSelection("plaintext");
  const imageSelection = useSelection("image");
  const intl = useIntl();
  const apiClient = ApiClient.getInstance();


  const searchAgents = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // Cancel any existing search request
    if (currentSearchController.current) {
      currentSearchController.current.abort();
    }

    // Create new AbortController for this request
    const controller = new AbortController();
    currentSearchController.current = controller;

    setLoading(true);
    try {
      const response = await apiClient.searchAgents(query);

      // Check if this request was aborted
      if (controller.signal.aborted) {
        return;
      }

      if (!response.success) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      const data = response.data as any;

      // Get agents array from the 'result' property
      let agentArray: Record<string, unknown>[] = [];

      if (data?.result && Array.isArray(data.result)) {
        agentArray = data.result;
      }

      // Transform agent list response to AgentSearchResult format
      const results: AgentSearchResult[] = agentArray.map((agent: Record<string, unknown>, index: number) => {
        const name = (agent.name as string) || (agent.displayName as string) || (agent.fullName as string) || (agent.firstName as string) || "Unknown Agent";
        const office = (agent.office as string) || "";
        const displayValue = office ? `${name} - ${office}` : name;

        return {
          id: (agent.id as string) || (agent._id as string) || `agent-${index}`,
          displayValue,
          email: (agent.email as string) || (agent.emailAddress as string) || "",
          data: agent,
        };
      });

      // Only update state if request wasn't aborted
      if (!controller.signal.aborted) {
        setSearchResults(results);
        setShowResults(true);
      }
    } catch (error) {
      // Don't update state if request was aborted
      if (!controller.signal.aborted) {
        setSearchResults([]);
        setShowResults(false);
      }
    } finally {
      // Only update loading state if request wasn't aborted
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [apiClient]);

  const fetchAgentProfile = useCallback(async (email: string) => {
    if (!email) {
      return;
    }

    setLoadingProfile(true);
    try {
      const response = await apiClient.getAgentProfile(email);
      
      if (!response.success) {
        setAgentProfile(null);
        return;
      }

      const data = response.data as any;
      const agentData = data?.result?.rows?.[0] || {};

      // Transform profile response to AgentProfileData format
      const profileData: AgentProfileData = {
        agent: agentData,
        images: Object.entries(agentData)
          .filter(([, value]) => 
            typeof value === "string" && 
            (value.startsWith("http") && (value.includes(".jpg") || value.includes(".png") || value.includes(".jpeg") || value.includes(".gif")))
          )
          .map(([field, url]) => ({ field, url: url as string })),
        textFields: Object.entries(agentData)
          .filter(([key, value]) => 
            typeof value === "string" && 
            !key.toLowerCase().includes("image") && 
            !key.toLowerCase().includes("photo") &&
            !(value.startsWith("http")) &&
            key !== "email" && // Exclude email field to avoid duplication
            key !== "id"
          )
          .map(([field, value]) => ({ field, value: value as string })),
      };

      setAgentProfile(profileData);
    } catch {
      setAgentProfile(null);
    } finally {
      setLoadingProfile(false);
    }
  }, [apiClient]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (currentSearchController.current) {
        currentSearchController.current.abort();
      }
    };
  }, []);

  // Load current user's profile on mount - only once
  useEffect(() => {
    if (userEmail && !hasLoadedInitialProfile.current) {
      hasLoadedInitialProfile.current = true;

      // Set search query to user email
      setSearchQuery(userEmail);

      // Create a fake selected agent for the logged-in user
      const currentUserAgent: AgentSearchResult = {
        id: 'current-user',
        displayValue: 'My Profile',
        email: userEmail,
        data: { email: userEmail }
      };

      setSelectedAgent(currentUserAgent);
      fetchAgentProfile(userEmail);
    }
  }, [userEmail, fetchAgentProfile]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If query is empty, clear results immediately
    if (!value.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // Debounce search by 300ms
    searchTimeoutRef.current = setTimeout(() => {
      searchAgents(value);
    }, 300);
  }, [searchAgents]);

  const handleAgentSelect = useCallback(async (agent: AgentSearchResult) => {
    setSelectedAgent(agent);
    setSearchQuery(agent.displayValue);
    setShowResults(false);
    setSearchResults([]);
    setAgentProfile(null);

    // Fetch the agent's detailed profile
    if (agent.email) {
      await fetchAgentProfile(agent.email);
    }
  }, [fetchAgentProfile]);

  const handleTextFieldClick = useCallback(async (value: string) => {
    try {
      const selection = await textSelection.read();
      
      if (selection.contents.length > 0) {
        // Replace selected text
        const content = selection.contents[0];
        content.text = value;
        await selection.save();
      } else {
        // Add new text element
        addElement({
          type: "text",
          children: [value],
        });
      }
    } catch {
      // Fallback: add new text element
      addElement({
        type: "text",
        children: [value],
      });
    }
  }, [textSelection, addElement]);

  const handleImageClick = useCallback(async (imageUrl: string) => {
    // Prevent double-clicks during upload
    if (uploadingImages.has(imageUrl)) return;
    
    // Add to uploading set
    setUploadingImages(prev => new Set(prev).add(imageUrl));
    
    try {
      // Create a proxy URL to bypass CORS issues
      const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}`;
      
      // Get original image dimensions
      const img = new Image();
      const imageDimensions = await new Promise<{width: number, height: number}>((resolve, reject) => {
        img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = proxyUrl;
      });
      
      // First upload the image to get a valid ImageRef with original dimensions
      const { ref } = await upload({
        type: "image",
        url: proxyUrl,
        thumbnailUrl: proxyUrl,
        mimeType: "image/jpeg",
        width: imageDimensions.width,
        height: imageDimensions.height,
        aiDisclosure: "none",
      });

      const selection = await imageSelection.read();
      
      if (selection.contents.length > 0) {
        // Replace selected image
        const content = selection.contents[0];
        content.ref = ref;
        await selection.save();
      } else {
        // Add new image element
        addElement({
          type: "image",
          ref,
          altText: {
            text: "Agent photo",
            decorative: false,
          },
        });
      }
    } catch (error) {
      console.error('Failed to add agent image:', error);
    } finally {
      // Remove from uploading set
      setUploadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(imageUrl);
        return newSet;
      });
    }
  }, [imageSelection, addElement, uploadingImages]);

  const handleClear = useCallback(() => {
    setSearchQuery("");
    setSelectedAgent(null);
    setAgentProfile(null);
    setSearchResults([]);
    setShowResults(false);
  }, []);


  return (
    <Rows spacing="3u">
      <SearchInputMenu
        value={searchQuery}
        onChange={handleSearchChange}
        onClear={handleClear}
        placeholder={intl.formatMessage({
          id: "agent_search.search_placeholder",
          defaultMessage: "Search agents...",
          description: "Placeholder text for agent search input",
        })}
        ariaLabel={intl.formatMessage({
          id: "agent_search.search_aria_label",
          defaultMessage: "Search for agents",
          description: "Aria label for agent search input",
        })}
        onOutsidePointerDown={() => setShowResults(false)}
      >
        {showResults && searchResults.length > 0 && (
          <Menu ariaLabel="Agent search results">
            {searchResults.map((agent) => (
              <MenuItem
                key={agent.id}
                label={agent.displayValue}
                description={agent.email}
                onClick={() => handleAgentSelect(agent)}
              />
            ))}
          </Menu>
        )}
      </SearchInputMenu>

      {selectedAgent && (
        <Rows spacing="1u">
          {/*
          <Text variant="regular">
            {intl.formatMessage({
              id: "agent_search.selected_agent",
              defaultMessage: "Selected Agent: {name}",
              description: "Label showing selected agent",
            }, { name: selectedAgent.displayValue })}
          </Text>

          {selectedAgent.email && (
            <Text variant="regular">
              {intl.formatMessage({
                id: "agent_search.agent_email",
                defaultMessage: "Email: {email}",
                description: "Agent email display",
              }, { email: selectedAgent.email })}
            </Text>
          )} 
          */}

          {loadingProfile && (
            <Rows spacing="1u">
              <LoadingIndicator size="medium" />
              <Text variant="regular">
                {intl.formatMessage({
                  id: "agent_search.loading_profile",
                  defaultMessage: "Loading agent profile...",
                  description: "Loading text while fetching agent profile",
                })}
              </Text>
            </Rows>
          )}

          {agentProfile && (
            <Rows spacing="1u">
              {/* Text Fields */}
              {agentProfile.textFields && agentProfile.textFields.length > 0 && (
                <Rows spacing="1u">
                  <Text variant="bold">
                    {intl.formatMessage({
                      id: "agent_search.profile_fields_label",
                      defaultMessage: "Profile Information:",
                      description: "Label for agent profile fields section",
                    })}
                  </Text>
                  <Rows spacing="1u">
                    {agentProfile.textFields.map((field, index) => (
                      <Columns key={`${field.field}-${index}`} spacing="1u" alignY="center">
                        <Column width="1/3">
                          <Text size="small" variant="bold">{field.field.toUpperCase()}</Text>
                        </Column>
                        <Column width="2/3">
                          <Pill
                            text={field.value}
                            onClick={() => handleTextFieldClick(field.value)}
                            ariaLabel={`Add ${field.field}: ${field.value}`}
                          />
                        </Column>
                      </Columns>
                    ))}
                  </Rows>
                </Rows>
              )}

              {/* Images */}
              {agentProfile.images && agentProfile.images.length > 0 && (
                <Masonry targetRowHeightPx={200}>
                  {agentProfile.images.map((image, index) => (
                    <MasonryItem
                      key={`${image.field}-${index}`}
                      targetHeightPx={200}
                      targetWidthPx={200}
                    >
                      <div style={{ position: 'relative' }}>
                        <ImageCard
                          thumbnailUrl={image.url}
                          onClick={() => handleImageClick(image.url)}
                          alt={`${image.field} photo`}
                          ariaLabel={`Add ${image.field} photo to design`}
                          disabled={uploadingImages.has(image.url)}
                        />
                        {uploadingImages.has(image.url) && (
                          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                            <Box
                              width="full"
                              height="full"
                              background="neutral"
                              borderRadius="standard"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <LoadingIndicator size="small" />
                            </Box>
                          </div>
                        )}
                      </div>
                    </MasonryItem>
                  ))}
                </Masonry>
              )}
            </Rows>
          )}
        </Rows>
      )}

      {loading && (
        <Rows spacing="1u" align="center">
          <LoadingIndicator size="medium" />
          <Text variant="regular">
            {intl.formatMessage({
              id: "agent_search.searching",
              defaultMessage: "Searching agents...",
              description: "Loading text while searching agents",
            })}
          </Text>
        </Rows>
      )}
    </Rows>
  );
};