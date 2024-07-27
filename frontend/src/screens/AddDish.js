import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './AddDish.css'; // Import the CSS file

const AddDish = () => {
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            toast.error("Login with admin username and password first")
            navigate('/login'); // Redirect to login if user is not found
        }
    }, [navigate]);
    const [categoryName, setCategoryName] = useState('');
    const [name, setName] = useState('');
    const [img, setImg] = useState('');
    const [options, setOptions] = useState('');
    const [description, setDescription] = useState('');
    const [isHovered, setIsHovered] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        let optionsArray;
        try {
            optionsArray = JSON.parse(options);
            if (!Array.isArray(optionsArray)) {
                throw new Error('Options should be an array of objects with either full or half property, but not both');
            }
        } catch (error) {
            toast.error('Invalid options format. Use JSON format with objects containing "full" or "half" or both.');
            return;
        }

        const newDish = {
            CategoryName: categoryName,
            name,
            img,
            options: optionsArray,
            description,
        };

        try {
            const response = await fetch('http://localhost:5000/api/auth/addFoodItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newDish),
            });

            if (response.ok) {
                toast.success('Dish added successfully!');
                navigate('/admin_panel');
            } else {
                toast.error('Failed to add dish.');
            }
        } catch (error) {
            console.error('Error adding dish:', error);
            toast.error('Failed to add dish.');
        }
    };

    return (
        <div className="content">
            <h1>Add New Dish</h1>
            <form className="form" onSubmit={handleSubmit}>
                <input
                    className="input"
                    type="text"
                    placeholder="Category Name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                />
                <input
                    className="input"
                    type="text"
                    placeholder="Dish Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    className="input"
                    type="text"
                    placeholder="Image Path"
                    value={img}
                    onChange={(e) => setImg(e.target.value)}
                    required
                />
                <textarea
                    className="input"
                    placeholder='Options (JSON format, e.g., [{"full": "300", "half": "170"}])'
                    value={options}
                    onChange={(e) => setOptions(e.target.value)}
                    required
                />
                <textarea
                    className="input"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <button
                    className="button"
                    type="submit"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={isHovered ? { backgroundColor: '#218838', transform: 'scale(1.05)' } : {}}
                >
                    Add Dish
                </button>
            </form>
        </div>
    );
};

export default AddDish;
