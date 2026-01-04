import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import {
  MemoryRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import * as styles from "styles/components.css";
import { AgentDetailsPage } from "../../pages/agent_details_page/agent_details_page";
import { ListPage } from "../../pages/list_page/list_page";
import { ListingDetailsPage as ListingDetailsPage } from "../../pages/listing_details_page/listing_details_page";
import { LoadingPage } from "../../pages/loading_page/loading_page";
import { OfficeSelectionPage } from "../../pages/office_selection_page/office_selection_page";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 1, // 1 minute
      retryOnMount: false,
      retry: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className={styles.scrollContainer}>
          <Routes>
            <Route path="/" element={<Navigate to="/entry" replace />} />
            <Route path="/entry" element={<OfficeSelectionPage />} />
            <Route path="/loading" element={<LoadingPage />} />
            <Route path="/list/:tab?" element={<ListPage />} />
            <Route path="/details/listing" element={<ListingDetailsPage />} />
            <Route path="/details/agent" element={<AgentDetailsPage />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}
