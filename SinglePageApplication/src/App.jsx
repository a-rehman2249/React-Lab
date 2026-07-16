import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Link,
  useOutletContext,
  useParams,
  useNavigate
} from "react-router-dom";

const courses = [
  {
    id: 1,
    title: "Javascriptlearning",
    description: "Advance js course",
    lessons: [
      { id: 1, topic: "intro to js" },
      { id: 2, topic: "intro to react" },
      { id: 3, topic: "intro to next js" },
    ],
  },
  {
    id: 2,
    title: "C++",
    description:'advance c++ course',
    lessons: [
      { id: 1, topic: "intro to flowchart" },
      { id: 2, topic: "intro to syntax" },
    ],
  },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Landing /> },
      { path: "login", element: <Login /> },
      { path: "*", element: <ErrorPage /> },
      { path: "courses",element: <Courseslist /> },
      {
        path:'courses/:courseid',
        element:<CourseDetail />,
        children:[
          {index:true, element:<Courseoverview />},
          {path:'description', element:<Coursedescription/>},
          {path:'reviews', element:<Coursereviews/>}
        ]
      },
      {
        path:'courses/:courseid/learn/:lessonid',
        element:<Lesson/>
      }
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

function Layout() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/courses">Courses</Link>
      </nav>
      <div>
        <Outlet />
      </div>
      <footer>Here is the footer</footer>
    </>
  );
}

function Landing() {
  return <div>Here is the landing page</div>;
}

function Login() {
  return <div>Here is the login page</div>;
}

function ErrorPage() {
  return <div>Error... Nothing to show</div>;
}

function Courseslist() {
  return (
    <div>
      <p>Courses List:</p>

      <div>
        {courses.map((course, index) => {
          return (
            <div key={course.id}>
              <Link to={`/courses/${course.id}`}>
                {course.title}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CourseDetail(){
  const {courseid} =useParams();
  const course = courses.find(c=>c.id == courseid)

  if(!course){
    return <div>No such course found</div>
  }

  return(
    <>
    <h4>
      {course.title}
    </h4>
    <div style={{border:'1px solid black', padding:'5px'}}>
        <div>
          <Link to={`/courses/${courseid}`}>Overview</Link>
        </div>
        <div>
          <Link to={`/courses/${courseid}/description`}>Description</Link>
        </div>
        <div>
          <Link to={`/courses/${courseid}/reviews`}>Reviews</Link>
        </div>
    </div>
    <div style={{border:'1px solid black', padding:'5px', margin:'5px'}}>
      <Outlet context={course}/>
    </div>
    </>
  )
}

function Coursereviews(){
  return <div>*****</div>
}

function Coursedescription(){
  const course= useOutletContext();
  return(
    <div>
        {course.description}
    </div>
  )
}

function Courseoverview(){
  const course= useOutletContext();
  
  return(
    <div style={{border:'1px solid black', padding:'5px', margin:'5px'}}>
      {course.lessons.map((lesson,index)=>{
        return(
        <div key={lesson.id}>
          <Link to={`/courses/${course.id}/learn/${lesson.id}`}>{lesson.topic}</Link>
        </div>)
      })}
    </div>
  )
}

function Lesson(){
    const {courseid , lessonid}= useParams();
    const course = courses.find(c=>c.id==courseid);

    if(!course) return <div>Course not exist</div>

    const lesson = course.lessons.find(l=>l.id==lessonid);
    const lessonindex = course.lessons.findIndex(l=>l.id==lessonid);

    const nextlesson = course.lessons[lessonindex+1]

    if(!lesson) return <div>lesson not exist</div>

    return(
      <>
        <h2>{course.title}</h2>
        <h3>{lesson.topic}</h3>
        <p>Assume a music player</p>
        <div>
          <Link to={`/courses/${courseid}`}>Go Back</Link>
        </div>
        <div>
          {nextlesson && <Link to={`/courses/${courseid}/learn/${Number(lessonid)+1}`}>Next Video</Link>}
        </div>
      </>
    )
}

export default App;
