"use client";

import dynamic from "next/dynamic";

const TaskCard = dynamic(
  () => import("@/components/PagesComponents/TaskCard"),
  { ssr: false },
);
const ProjectCard = dynamic(() => import("@/components/ProjectCard"), {
  ssr: false,
});
const UserCard = dynamic(() => import("@/components/UsersCard"), {
  ssr: false,
});

import Header from "@/components/Header";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { useSearchTermQuery } from "../state/api";
import TailChaseLoader from "@/components/TailChaseLoader";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: searchResults,
    isLoading,
    isError,
  } = useSearchTermQuery(searchTerm, {
    skip: searchTerm.length < 3,
  });

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    500,
  );

  useEffect(() => {
    return handleSearch.cancel;
  }, [handleSearch.cancel]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <TailChaseLoader />
      </div>
    );
  }

  return (
    <div className="p-8">
      <Header name="Search" />
      <div>
        <input
          type="text"
          placeholder="Search..."
          className="w-1/2 rounded border p-3 shadow"
          onChange={handleSearch}
        />
      </div>
      <div className="p-5">
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error occurred while fetching search results.</p>}
        {!isLoading && !isError && searchResults && (
          <div>
            {searchResults.tasks && searchResults.tasks?.length > 0 && (
              <h2>Tasks</h2>
            )}
            {searchResults.tasks?.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}

            {searchResults.projects && searchResults.projects?.length > 0 && (
              <h2>Projects</h2>
            )}
            {searchResults.projects?.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}

            {searchResults.users && searchResults.users?.length > 0 && (
              <h2>Users</h2>
            )}
            {searchResults.users?.map((user) => (
              <UserCard key={user.userId} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
