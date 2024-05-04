import { collection, addDoc } from 'firebase/firestore';
import { db } from './config';

const saveUserToFirestore = async (userData: any) => {
    try {
        const usersCollectionRef = collection(db, 'users');
        await addDoc(usersCollectionRef, userData);
        console.log('User data saved to Firestore');
    } catch (error) {
        console.error('Error saving user data:', error);
        throw new Error('Failed to save user data to Firestore');
    }
};

export { saveUserToFirestore };
