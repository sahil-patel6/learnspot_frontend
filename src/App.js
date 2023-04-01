import React from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import NoPage from './Components/NoPage';
import SignInPage from './SignInPage/SignInPage';
import HomePage from './HomePage/HomePage';
import {Routes, Route, BrowserRouter } from 'react-router-dom';
import SemestersPage from './Semesters/SemestersPage';
import SubjectsPage from './Subjects/SubjectsPage';
import TeachersPage from './Teachers/TeachersPage';
import StudentPage from './Students/StudentsPage';
import ParentPage from './Parents/ParentsPage';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/teachers" element={<TeachersPage />} />
          <Route path="/students" element={<StudentPage />} />
          <Route path="/parents" element={<ParentPage />} />
          <Route
            path="/department/:department_id/semesters"
            element={<SemestersPage />}
          />
          <Route
            path="/department/:department_id/semesters/:semester_id/subjects"
            element={<SubjectsPage />}
          />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
