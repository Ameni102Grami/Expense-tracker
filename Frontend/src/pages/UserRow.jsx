import React from "react";

const UserRow = ({
  user,
  editingUser,
  editingUserInfo,
  handleChange,
  handleEdit,
  handleDelete,
  handleSave,
}) => {
  return (
    <tr key={user.id}>
      <td className="px-6 py-4 whitespace-nowrap">
        {editingUser === user._id ? (
          <input
            type="text"
            defaultValue={user.username}
            value={
              editingUserInfo.username === ""
                ? user.username.concat(editingUserInfo.username)
                : editingUserInfo.username
            }
            name="username"
            onChange={(e) => handleChange(e, user._id)}
            className="text-sm text-gray-900"
          />
        ) : (
          <div className="text-sm text-gray-900">{user.username}</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {editingUser === user._id ? (
          <input
            type="text"
            defaultValue={user.name}
            value={
              editingUserInfo.name === ""
                ? user.name.concat(editingUserInfo.name)
                : editingUserInfo.name
            }
            onChange={(e) => handleChange(e, user._id)}
            name="name"
            className="text-sm text-gray-900"
          />
        ) : (
          <div className="text-sm text-gray-900">{user.name}</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <img
          src={user.profilePicture}
          alt={user.name}
          className="h-10 w-10 rounded-full"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {editingUser === user._id ? (
          <select
            defaultValue={user.gender}
            value={
              editingUserInfo.gender === ""
                ? user.name.concat(editingUserInfo.gender)
                : editingUserInfo.gender
            }
            className="text-sm text-gray-900"
            name="gender"
            onChange={(e) => handleChange(e, user._id)}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        ) : (
          user.gender
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(user.updatedAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        {editingUser === user._id ? (
          <button
            onClick={() => handleSave(user)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => handleEdit(user)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Edit
          </button>
        )}
        <button
          onClick={() => handleDelete(user)}
          className="text-red-600 hover:text-red-900 ml-4"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default UserRow;
