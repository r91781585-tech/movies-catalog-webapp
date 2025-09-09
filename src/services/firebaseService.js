import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

// User operations
export const createUserProfile = async (uid, userData) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp()
    });
    
    // Create default favorites list
    await createList(uid, 'Favorites', true);
    
    return userRef;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// List operations
export const createList = async (uid, name, isDefault = false) => {
  try {
    const listsRef = collection(db, 'users', uid, 'lists');
    const listDoc = await addDoc(listsRef, {
      name,
      isDefault,
      isPublic: false,
      createdAt: serverTimestamp()
    });
    
    return listDoc.id;
  } catch (error) {
    console.error('Error creating list:', error);
    throw error;
  }
};

export const getUserLists = async (uid) => {
  try {
    const listsRef = collection(db, 'users', uid, 'lists');
    const q = query(listsRef, orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const lists = [];
    querySnapshot.forEach((doc) => {
      lists.push({ id: doc.id, ...doc.data() });
    });
    
    return lists;
  } catch (error) {
    console.error('Error getting user lists:', error);
    throw error;
  }
};

export const updateList = async (uid, listId, updates) => {
  try {
    const listRef = doc(db, 'users', uid, 'lists', listId);
    await updateDoc(listRef, updates);
  } catch (error) {
    console.error('Error updating list:', error);
    throw error;
  }
};

export const deleteList = async (uid, listId) => {
  try {
    // First delete all items in the list
    const itemsRef = collection(db, 'users', uid, 'lists', listId, 'listItems');
    const itemsSnapshot = await getDocs(itemsRef);
    
    const deletePromises = itemsSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    // Then delete the list itself
    const listRef = doc(db, 'users', uid, 'lists', listId);
    await deleteDoc(listRef);
  } catch (error) {
    console.error('Error deleting list:', error);
    throw error;
  }
};

// List item operations
export const addMovieToList = async (uid, listId, movieData) => {
  try {
    const itemsRef = collection(db, 'users', uid, 'lists', listId, 'listItems');
    
    // Check if movie already exists in the list
    const q = query(itemsRef, where('movieId', '==', movieData.imdbID));
    const existingItems = await getDocs(q);
    
    if (!existingItems.empty) {
      throw new Error('Movie already exists in this list');
    }
    
    const itemDoc = await addDoc(itemsRef, {
      movieId: movieData.imdbID,
      title: movieData.Title,
      year: movieData.Year,
      poster: movieData.Poster,
      type: movieData.Type,
      addedAt: serverTimestamp(),
      metadata: {
        plot: movieData.Plot || '',
        director: movieData.Director || '',
        actors: movieData.Actors || '',
        genre: movieData.Genre || '',
        imdbRating: movieData.imdbRating || ''
      }
    });
    
    return itemDoc.id;
  } catch (error) {
    console.error('Error adding movie to list:', error);
    throw error;
  }
};

export const removeMovieFromList = async (uid, listId, movieId) => {
  try {
    const itemsRef = collection(db, 'users', uid, 'lists', listId, 'listItems');
    const q = query(itemsRef, where('movieId', '==', movieId));
    const querySnapshot = await getDocs(q);
    
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error removing movie from list:', error);
    throw error;
  }
};

export const getListItems = async (uid, listId) => {
  try {
    const itemsRef = collection(db, 'users', uid, 'lists', listId, 'listItems');
    const q = query(itemsRef, orderBy('addedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    
    return items;
  } catch (error) {
    console.error('Error getting list items:', error);
    throw error;
  }
};

export const isMovieInList = async (uid, listId, movieId) => {
  try {
    const itemsRef = collection(db, 'users', uid, 'lists', listId, 'listItems');
    const q = query(itemsRef, where('movieId', '==', movieId));
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking if movie is in list:', error);
    return false;
  }
};