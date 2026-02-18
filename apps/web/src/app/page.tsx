import VeggieCard from '@/components/VeggieCard';
import Table from '@/components/Dashboard/Dashboard';
import styles from './page.module.scss';
import Dashboard from '@/components/Dashboard/Dashboard';

export default function Home() {
  // interface User {
  //   id: number;
  //   name: string;
  //   email: string;
  //   role: string;
  //   department: string;
  //   status: string;
  // }

  // const columns = [
  //   { key: 'id', label: 'ID' },
  //   { key: 'name', label: 'Name' },
  //   { key: 'email', label: 'Email' },
  //   { key: 'role', label: 'Role' },
  //   { key: 'department', label: 'Department' },
  //   { key: 'status', label: 'Status' }
  // ];

  // const data: User[] = [
  //   { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', department: 'Engineering', status: 'Active' },
  //   { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User', department: 'Marketing', status: 'Active' },
  //   { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', department: 'Sales', status: 'Active' },
  //   { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'Manager', department: 'Engineering', status: 'Active' },
  //   { id: 5, name: 'Edward Norton', email: 'edward@example.com', role: 'User', department: 'Finance', status: 'Inactive' },
  //   { id: 6, name: 'Fiona Green', email: 'fiona@example.com', role: 'Admin', department: 'HR', status: 'Active' },
  //   { id: 7, name: 'George Miller', email: 'george@example.com', role: 'User', department: 'Engineering', status: 'Active' },
  //   { id: 8, name: 'Hannah White', email: 'hannah@example.com', role: 'Manager', department: 'Marketing', status: 'Active' },
  //   { id: 9, name: 'Ian Black', email: 'ian@example.com', role: 'User', department: 'Sales', status: 'Active' },
  //   { id: 10, name: 'Julia Roberts', email: 'julia@example.com', role: 'Admin', department: 'Engineering', status: 'Active' },
  //   { id: 11, name: 'Kevin Hart', email: 'kevin@example.com', role: 'User', department: 'Finance', status: 'Active' },
  //   { id: 12, name: 'Laura Palmer', email: 'laura@example.com', role: 'Manager', department: 'HR', status: 'Inactive' },
  //   { id: 13, name: 'Michael Scott', email: 'michael@example.com', role: 'Manager', department: 'Sales', status: 'Active' },
  //   { id: 14, name: 'Nancy Drew', email: 'nancy@example.com', role: 'User', department: 'Marketing', status: 'Active' },
  //   { id: 15, name: 'Oscar Martinez', email: 'oscar@example.com', role: 'User', department: 'Finance', status: 'Active' },
  //   { id: 16, name: 'Pam Beesly', email: 'pam@example.com', role: 'User', department: 'Sales', status: 'Active' },
  //   { id: 17, name: 'Quinn Fabray', email: 'quinn@example.com', role: 'Admin', department: 'Engineering', status: 'Active' },
  //   { id: 18, name: 'Rachel Green', email: 'rachel@example.com', role: 'User', department: 'Marketing', status: 'Inactive' },
  //   { id: 19, name: 'Steve Rogers', email: 'steve@example.com', role: 'Manager', department: 'HR', status: 'Active' },
  //   { id: 20, name: 'Tony Stark', email: 'tony@example.com', role: 'Admin', department: 'Engineering', status: 'Active' },
  //   { id: 21, name: 'Uma Thurman', email: 'uma@example.com', role: 'User', department: 'Finance', status: 'Active' },
  //   { id: 22, name: 'Victor Stone', email: 'victor@example.com', role: 'User', department: 'Engineering', status: 'Active' },
  //   { id: 23, name: 'Wanda Maximoff', email: 'wanda@example.com', role: 'Manager', department: 'Marketing', status: 'Active' },
  //   { id: 24, name: 'Xavier Charles', email: 'xavier@example.com', role: 'Admin', department: 'Sales', status: 'Active' },
  //   { id: 25, name: 'Yvonne Strahovski', email: 'yvonne@example.com', role: 'User', department: 'HR', status: 'Inactive' },
  //   { id: 26, name: 'Zachary Levi', email: 'zachary@example.com', role: 'User', department: 'Engineering', status: 'Active' },
  //   { id: 27, name: 'Aria Montgomery', email: 'aria@example.com', role: 'Manager', department: 'Finance', status: 'Active' },
  //   { id: 28, name: 'Blake Lively', email: 'blake@example.com', role: 'User', department: 'Marketing', status: 'Active' },
  //   { id: 29, name: 'Claire Underwood', email: 'claire@example.com', role: 'Admin', department: 'Sales', status: 'Active' },
  //   { id: 30, name: 'Derek Shepherd', email: 'derek@example.com', role: 'User', department: 'Engineering', status: 'Active' },
  // ];

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Veggie Rescue</h1>
      <p className={styles.description}>Rescuing vegetables, reducing waste.</p>

      <section className={styles.grid}>
        <VeggieCard
          name="Organic Carrots"
          description="Fresh locally-grown carrots, perfect for soups and salads."
          daysUntilExpiry={5}
          imageEmoji="🥕"
        />
        <VeggieCard
          name="Baby Spinach"
          description="Tender spinach leaves, great for smoothies."
          daysUntilExpiry={2}
          imageEmoji="🥬"
        />
        <VeggieCard
          name="Ripe Tomatoes"
          description="Vine-ripened tomatoes ready to use today."
          daysUntilExpiry={1}
          imageEmoji="🍅"
        />

        
        <Dashboard />
      </section>
    </main>
  );
}
