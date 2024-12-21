import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../api';

const UserProfile = ({ userId }) => {
    // State för att hantera användaruppgifter
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await getUserProfile(userId);
                setName(response.data.name);
                setEmail(response.data.email);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUserProfile(userId, { name, email });
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Your Profile</h2>
            <label>
                Name:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <br />
            <label>
                Email:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <br />
            <button type="submit">Update Profile</button>
        </form>
    );
};

export default UserProfile;
