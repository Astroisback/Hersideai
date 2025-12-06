import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, deleteDoc, doc, writeBatch } from "firebase/firestore";

/**
 * Helper function to delete all documents matching a query
 * @param {Query} q - Firestore query
 */
async function deleteDocumentsByQuery(q) {
    const snapshot = await getDocs(q);
    const promises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(promises);
    return snapshot.size;
}

/**
 * Helper function to delete a subcollection
 * @param {string} parentCollection - Parent collection name
 * @param {string} parentId - Parent document ID
 * @param {string} subCollection - Subcollection name
 */
async function deleteSubcollection(parentCollection, parentId, subCollection) {
    const q = query(collection(db, parentCollection, parentId, subCollection));
    return await deleteDocumentsByQuery(q);
}

/**
 * Permanently deletes a customer account and all associated data
 * @param {string} customerId - The ID of the customer to delete
 */
export const deleteCustomerAccount = async (customerId) => {
    if (!customerId) return;

    try {
        console.log(`Starting deletion for customer: ${customerId}`);

        // 1. Delete Orders
        const ordersQuery = query(collection(db, "orders"), where("customerId", "==", customerId));
        await deleteDocumentsByQuery(ordersQuery);

        // 2. Delete Bookings
        const bookingsQuery = query(collection(db, "bookings"), where("customerId", "==", customerId));
        await deleteDocumentsByQuery(bookingsQuery);

        // 3. Delete Chats (where customer is a participant)
        const chatsQuery = query(collection(db, "chats"), where("participants", "array-contains", customerId));
        await deleteDocumentsByQuery(chatsQuery);

        // 4. Delete Reviews (given by customer)
        const reviewsQuery = query(collection(db, "reviews"), where("customerId", "==", customerId));
        await deleteDocumentsByQuery(reviewsQuery);

        // 5. Delete Customer Document
        await deleteDoc(doc(db, "customers", customerId));

        console.log(`Successfully deleted customer account: ${customerId}`);
        return true;
    } catch (error) {
        console.error("Error deleting customer account:", error);
        throw error;
    }
};

/**
 * Permanently deletes a seller account and all associated data
 * @param {string} sellerId - The ID of the seller to delete
 */
export const deleteSellerAccount = async (sellerId) => {
    if (!sellerId) return;

    try {
        console.log(`Starting deletion for seller: ${sellerId}`);

        // 1. Delete Products
        const productsQuery = query(collection(db, "products"), where("sellerId", "==", sellerId));
        await deleteDocumentsByQuery(productsQuery);

        // 2. Delete Services
        const servicesQuery = query(collection(db, "services"), where("sellerId", "==", sellerId));
        await deleteDocumentsByQuery(servicesQuery);

        // 3. Delete Orders (received by seller)
        const ordersQuery = query(collection(db, "orders"), where("sellerId", "==", sellerId));
        await deleteDocumentsByQuery(ordersQuery);

        // 4. Delete Bookings (received by seller)
        const bookingsQuery = query(collection(db, "bookings"), where("sellerId", "==", sellerId));
        await deleteDocumentsByQuery(bookingsQuery);

        // 5. Delete Chats (where seller is a participant)
        const chatsQuery = query(collection(db, "chats"), where("participants", "array-contains", sellerId));
        await deleteDocumentsByQuery(chatsQuery);

        // 6. Delete Reviews (received by seller)
        const reviewsQuery = query(collection(db, "reviews"), where("sellerId", "==", sellerId));
        await deleteDocumentsByQuery(reviewsQuery);

        // 7. Delete Availability Subcollection
        await deleteSubcollection("sellers", sellerId, "availability");

        // 8. Delete Seller Document
        await deleteDoc(doc(db, "sellers", sellerId));

        console.log(`Successfully deleted seller account: ${sellerId}`);
        return true;
    } catch (error) {
        console.error("Error deleting seller account:", error);
        throw error;
    }
};
