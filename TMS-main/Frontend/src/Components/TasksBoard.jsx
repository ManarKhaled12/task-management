import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import Column from "./TasksBoard/Column";
import DeleteArea from "./TasksBoard/DeleteArea";
import LoadingSpinner from "./Helpers/LoadingSpinner";
import Error from "./Helpers/Error";

import { useGetTasksQuery } from "../Redux/apis/taskApi";

const TasksBoard = () => {
  const { userData } = useSelector((state) => state.user);
  const { projectsData } = useSelector((state) => state.projects);
  const params = useParams();

  const { isLoading, isError } = useGetTasksQuery(
    { id: userData.id, role: userData.role, projectId: params.projectId },
    { refetchOnMountOrArgChange: true }
  );

  const project = projectsData.find((project) => project.projectId === params.projectId);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <div className='flex justify-between w-[90%]'>
        <h1 className='text-4xl text-neutral-200'>{project.title}</h1>
        <input
          type='text'
          defaultValue=''
          className='bg-transparent border-b border-neutral-600 focus:outline-none focus:border-b-violet-500 text-neutral-100'
          placeholder='Search'
        />
      </div>
      <div className='flex h-full w-full gap-3  p-12'>
        <Column title='Backlog' column='backlog' headingColor='text-neutral-500' />
        <Column title='TODO' column='todo' headingColor='text-yellow-200' />
        <Column title='In Progress' column='in-progress' headingColor='text-blue-200' />
        <Column title='Done' column='done' headingColor='text-emerald-200' />
        <DeleteArea />
      </div>
    </>
  );
};

export default TasksBoard;
