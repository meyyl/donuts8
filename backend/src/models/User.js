import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: false, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true }
);

// 🔧 Hash password sebelum disimpan
userSchema.pre("save", async function (next) {
  try {
    // jika username kosong, isi otomatis
    if (!this.username && this.name) {
      this.username = this.name.toLowerCase().replace(/\s+/g, "_");
    }

    // hanya hash jika password diubah atau baru
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", userSchema);
export default User;
