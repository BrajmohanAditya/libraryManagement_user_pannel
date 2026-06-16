import React, { useState } from "react";
import HeroBanner from "./heroBanner";
import LibraryCard from "../../components/LibraryCard";
import { useGetLibrariesHook, useSearchLibrariesHook } from "../../hooks/library.hook";
import { Loader2, XCircle } from "lucide-react";

const Home = () => {
  const [searchVal, setSearchVal] = useState("");
  const [submittedSearchQuery, setSubmittedSearchQuery] = useState("");

  // Hook to get all libraries (active when no search query is submitted)
  const {
    data: allLibrariesData,
    isLoading: isLoadingAll,
    isError: isErrorAll,
  } = useGetLibrariesHook({ enabled: !submittedSearchQuery });

  // Hook to search libraries (active when a search query is submitted)
  const {
    data: searchLibrariesData,
    isLoading: isLoadingSearch,
    isError: isErrorSearch,
  } = useSearchLibrariesHook(submittedSearchQuery);

  const handleSearchSubmit = () => {
    setSubmittedSearchQuery(searchVal.trim());
  };

  const handleClearSearch = () => {
    setSearchVal("");
    setSubmittedSearchQuery("");
  };

  const isLoading = submittedSearchQuery ? isLoadingSearch : isLoadingAll;
  const isError = submittedSearchQuery ? isErrorSearch : isErrorAll;
  
  // Retrieve the correct array of libraries from backend response structures
  const rawData = submittedSearchQuery ? searchLibrariesData : allLibrariesData;
  const libraries = rawData?.data || [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Title Section above the Banner */}
      <div className="px-4 md:px-8 pt-8 pb-4 max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          Explore Premium <span className="text-blue-600">Libraries</span>
        </h1>
        <p className="text-slate-500 text-sm md:text-base mt-2">
          Find your perfect study space, compare pricing, and book your seat instantly.
        </p>
      </div>

      {/* Hero Banner Section */}
      <div className="px-4 md:px-8 max-w-7xl mx-auto">
        <HeroBanner
          searchVal={searchVal}
          setSearchVal={setSearchVal}
          onSearch={handleSearchSubmit}
        />
      </div>

      {/* Libraries Grid Section */}
      <div className="px-4 md:px-8 py-12 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              {submittedSearchQuery ? "Search Results" : "Available Libraries"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {submittedSearchQuery
                ? `Showing results for "${submittedSearchQuery}"`
                : "Browse top-rated study spaces in your city"}
            </p>
          </div>

          {submittedSearchQuery && (
            <button
              onClick={handleClearSearch}
              className="self-start sm:self-auto px-4 py-2 border border-slate-200 hover:border-slate-300 rounded-full text-sm font-semibold text-slate-600 hover:text-slate-800 transition flex items-center gap-2 cursor-pointer bg-white"
            >
              <XCircle className="w-4 h-4 text-slate-400" />
              Clear Search
            </button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading spaces near you...</p>
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <p className="text-rose-500 font-semibold mb-2">Oops! Something went wrong.</p>
            <p className="text-slate-500 text-sm">Failed to retrieve libraries. Please try again later.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && libraries.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <p className="text-slate-700 font-semibold text-lg mb-1">No Libraries Found</p>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              We couldn't find any study spaces matching your criteria. Try searching for a different city or area.
            </p>
            {submittedSearchQuery && (
              <button
                onClick={handleClearSearch}
                className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition cursor-pointer"
              >
                Reset Search
              </button>
            )}
          </div>
        )}

        {/* Data Grid */}
        {!isLoading && !isError && libraries.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {libraries.map((library) => (
              <div key={library.id}>
                <LibraryCard library={library} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
