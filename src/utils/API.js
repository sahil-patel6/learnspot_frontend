class API {
  // static BASE_URL = "https://learnspot-api.up.railway.app/api/v1";
  static BASE_URL = 'http://192.168.1.7:8000/api/v1';

  static SIGNIN_URL = `${this.BASE_URL}/admin/signin`;

  /// DEPARTMENTS
  static GET_ALL_DEPARTMENTS = (admin_id) => `${this.BASE_URL}/departments/admin/${admin_id}`;
  static CREATE_DEPARTMENT = (admin_id) => `${this.BASE_URL}/department/create/admin/${admin_id}`;
  static UPDATE_DEPARTMENT = (department_id,admin_id) => `${this.BASE_URL}/department/${department_id}/admin/${admin_id}`;
  static DELETE_DEPARTMENT = (department_id,admin_id) => `${this.BASE_URL}/department/${department_id}/admin/${admin_id}`;

  /// SEMESTERS
  static GET_ALL_SEMESTERS = (department_id,admin_id) => `${this.BASE_URL}/semesters/${department_id}/admin/${admin_id}`;
  static CREATE_SEMESTER = (admin_id) => `${this.BASE_URL}/semester/create/admin/${admin_id}`;
  static UPDATE_SEMESTER = (semester_id,admin_id) => `${this.BASE_URL}/semester/${semester_id}/admin/${admin_id}`;
  static DELETE_SEMESTER = (semester_id,admin_id) => `${this.BASE_URL}/semester/${semester_id}/admin/${admin_id}`;
  
  /// SUBJECTS
  static GET_ALL_SUBJECTS = (semester_id,admin_id) => `${this.BASE_URL}/subjects/${semester_id}/admin/${admin_id}`;
  static CREATE_SUBJECT = (admin_id) => `${this.BASE_URL}/subject/create/admin/${admin_id}`;
  static UPDATE_SUBJECT = (subject_id,admin_id) => `${this.BASE_URL}/subject/${subject_id}/admin/${admin_id}`;
  static DELETE_SUBJECT = (subject_id,admin_id) => `${this.BASE_URL}/subject/${subject_id}/admin/${admin_id}`;

}

exports.API = API;