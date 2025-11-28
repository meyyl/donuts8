import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, created_at");

    if (error) {
      console.error("Gagal memuat data user:", error.message);
    } else {
      setUsers(data);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl shadow-2xl border border-yellow-600/20">

      {/* Title */}
      <h2 className="text-3xl font-extrabold mb-6 text-center text-[#3b2215] drop-shadow-sm">
        👥 Daftar User Aktif
      </h2>

      {/* Card */}
      <div className="bg-white/60 border border-yellow-400/20 rounded-2xl backdrop-blur-xl p-6 shadow-xl">

        {loading ? (
          <p className="text-[#3b2215] text-center py-4 text-lg">
            Memuat data...
          </p>
        ) : users.length === 0 ? (
          <p className="text-[#3b2215] text-center py-4">
            Tidak ada user aktif.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-md">
            <table className="w-full text-sm text-[#3b2215] font-medium">
              <thead>
                <tr className="bg-gradient-to-r from-yellow-300/70 to-yellow-400/60 text-[#3b2215] font-semibold">
                  <th className="p-3 border border-yellow-500/20">ID</th>
                  <th className="p-3 border border-yellow-500/20">Email</th>
                  <th className="p-3 border border-yellow-500/20">Nama</th>
                  <th className="p-3 border border-yellow-500/20">Role</th>
                  <th className="p-3 border border-yellow-500/20">Dibuat</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`transition-all hover:bg-yellow-200/20 ${
                      index % 2 === 0 ? "bg-white/70" : "bg-white/40"
                    }`}
                  >
                    <td className="p-3 border border-yellow-500/10">
                      {user.id}
                    </td>
                    <td className="p-3 border border-yellow-500/10">
                      {user.email || "-"}
                    </td>
                    <td className="p-3 border border-yellow-500/10">
                      {user.full_name || "-"}
                    </td>
                    <td className="p-3 border border-yellow-500/10 text-yellow-700 font-semibold">
                      {user.role || "user"}
                    </td>
                    <td className="p-3 border border-yellow-500/10">
                      {new Date(user.created_at).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
