import { Suspense } from "react";
import ProjectsPage from "@/pages/ProjectsPage";

const Projects = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectsPage />
    </Suspense>
  );
};

export default Projects;
