import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../src/lib/db';
import Department from '../src/models/Department';
import User from '../src/models/User';

async function run() {
  await connectToDatabase();

  const deptName = 'Computer Science';
  let dept = await Department.findOne({ name: deptName });
  if (!dept) {
    dept = await Department.create({ name: deptName, code: 'CSE' });
    // eslint-disable-next-line no-console
    console.log('Created department:', dept.name);
  }

  const ensureUser = async (
    email: string,
    role: 'Principal' | 'HOD' | 'Faculty',
    password: string,
    departmentId?: string
  ) => {
    let user = await User.findOne({ email });
    if (!user) {
      const passwordHash = await bcrypt.hash(password, 10);
      user = await User.create({ email, role, passwordHash, departmentId });
      // eslint-disable-next-line no-console
      console.log('Created user:', email, role);
    } else {
      // eslint-disable-next-line no-console
      console.log('User exists:', email);
    }
  };

  await ensureUser('principal@lords.ac.in', 'Principal', 'ChangeMe@123');
  await ensureUser('hod@lords.ac.in', 'HOD', 'ChangeMe@123', String(dept._id));
  await ensureUser('faculty1@lords.ac.in', 'Faculty', 'ChangeMe@123', String(dept._id));
}

run()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Seed completed');
    process.exit(0);
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
