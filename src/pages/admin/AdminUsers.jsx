import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const { data, error } = await supabase
      .from("profiles")
      .select(`id, full_name, role, created_at`);

    if (error) {
      console.error("Error fetching users:", error.message);
    } else {
      setUsers(data);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">👥 Daftar Pengguna</h1>

      <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-yellow-200 text-[#3b2215]">
          <tr>
            <th className="p-3 text-left">Nama</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Tanggal Daftar</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-yellow-50">
                <td className="p-3">{user.full_name}</td>
                <td className="p-3 capitalize">{user.role || "user"}</td>
                <td className="p-3">
                  {new Date(user.created_at).toLocaleDateString("id-ID")}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center p-6 text-gray-500">
                Tidak ada pengguna ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
