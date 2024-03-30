import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { deleteData, fetchData, updateData } from "../utils/axios";
import { useNavigate } from "react-router-dom";
import UserRow from "./UserRow";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editingUserInfo, setEditingUserInfo] = useState({
    username: "",
    name: "",
    gender: "",
  });

  useEffect(() => {
    fetchData("http://localhost:8080/users").then((response) =>
      setUsers(response)
    );
  }, [editingUser]);

  const handleEdit = (user) => {
    setEditingUser(user._id);
  };

  const handleSave = (user) => {
    if (editingUserInfo.gender === "") editingUserInfo.gender = user.gender;
    if (editingUserInfo.name === "") editingUserInfo.name = user.name;
    if (editingUserInfo.username === "")
      editingUserInfo.username = user.username;

    updateData(`http://localhost:8080/users/${user._id}`, {
      profilePicture: user.profilePicture,
      ...editingUserInfo,
    }).then((response) => {
      toast.success("user updated successfully");
      setEditingUserInfo({
        username: "",
        name: "",
        gender: "",
      });
      setEditingUser(null);
      fetchData("http://localhost:8080/users").then((response) =>
        setUsers(response)
      );
    });
  };
  const handleChange = (event, id) => {
    const { name, value } = event.target;

    setEditingUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDelete = (user) => {
    deleteData(`http://localhost:8080/users/${user._id}`).then((response) =>
      toast.success("user Deleted successfully")
    );
    fetchData("http://localhost:8080/users").then((response) =>
      setUsers(response)
    );
    setEditingUser(null);
  };
  const navigate = useNavigate();
  return (
    <div class="container mx-auto px-9">
      <button
        type="button"
        class="w-full m-4 flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
        onClick={() => navigate("/")}
      >
        <svg
          class="w-5 h-5 rtl:rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
          />
        </svg>
        <span>Go back</span>
      </button>
      <div className="flex flex-col h-full p-12">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Username
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Profile Picture
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Gender
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Created At
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Updated At
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users?.map((user) => (
                    <UserRow
                      user={user}
                      editingUser={editingUser}
                      editingUserInfo={editingUserInfo}
                      handleChange={handleChange}
                      handleDelete={handleDelete}
                      handleEdit={handleEdit}
                      handleSave={handleSave}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
