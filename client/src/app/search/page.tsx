"use client";

import { useEffect, useState } from "react";
import { useSearchTermQuery } from "../state/api";
import { debounce } from "lodash";
import Header from "@/components/Header";
import { tailChase } from "ldrs";
import TaskCard from "@/components/PagesComponents/TaskCard";
import ProjectCard from "@/components/ProjectCard";
import UserCard from "@/components/UsersCard";
import { SearchResults } from "../types/searchResults";

tailChase.register();

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [localSearchResult, setLocalSearchResult] = useState<SearchResults>();
  const {
    data: searchResult,
    isLoading,
    isError,
  } = useSearchTermQuery(searchTerm, { skip: searchTerm.length < 3 });

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchTerm(value);
      if (value.length < 3) {
        setLocalSearchResult(undefined);
      }
    },
    500,
  );

  useEffect(() => {
    if (searchResult) {
      setLocalSearchResult(searchResult);
    }
  }, [searchResult]);

  return (
    <div className="p-8">
      <Header name="Search" />
      <div>
        <input
          type="search"
          placeholder="Search..."
          className="w-1/2 rounded border p-3 shadow"
          onChange={handleSearch}
        />
      </div>

      <div className="p-5">
        {isLoading && (
          <div className="flex h-full items-center justify-center">
            <l-tail-chase size="40" speed="1.75" color="gray" />
          </div>
        )}
        {isError && <p>Error fetching search results</p>}
        {!isLoading && !isError && localSearchResult && (
          <div>
            {localSearchResult.tasks && localSearchResult.tasks?.length > 0 && (
              <h2 className="dark:text-white">Tasks</h2>
            )}
            {localSearchResult.tasks?.map((task) => (
              <TaskCard key={task.id} task={task} canDelete />
            ))}
            {localSearchResult?.projects &&
              localSearchResult.projects?.length > 0 && (
                <h2 className="pb-5 dark:text-white">Projects</h2>
              )}
            {localSearchResult?.projects?.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
            {localSearchResult.users && localSearchResult.users?.length > 0 && (
              <h2 className="dark:text-white">Users</h2>
            )}
            {localSearchResult.users?.map((user) => (
              <UserCard key={user.userId} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
