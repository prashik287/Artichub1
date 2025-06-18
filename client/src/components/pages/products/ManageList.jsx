import React from "react";
import { Link } from "react-router-dom";

const ManageList = () => {
  const cards = [
    {
      title: "Create Product",
      icon: "➕", // Emoji for "Add"
      action: "Create",
      bgColor: "bg-green-100",
      iconColor: "text-green-500",
      btnColor: "bg-green-500 hover:bg-green-600",
      route: "/create-product",
    },
    {
      title: "Modify Product",
      icon: "✏️", // Emoji for "Edit"
      action: "Modify",
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-500",
      btnColor: "bg-yellow-500 hover:bg-yellow-600",
      route: "/modify-product",
    },
    {
      title: "Remove Product",
      icon: "🗑️", // Emoji for "Trash"
      action: "Remove",
      bgColor: "bg-red-100",
      iconColor: "text-red-500",
      btnColor: "bg-red-500 hover:bg-red-600",
      route: "/remove-product",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 justify-center items-center h-[100%]">
      {cards.map((card, index) => (
        <Link key={index} to={card.route} className="w-80">
          <div className={`p-6 shadow-lg rounded-xl ${card.bgColor} flex flex-col items-center text-center text-black`}>
            <div className={`text-4xl ${card.iconColor} mb-4`}>{card.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
            <button className={`px-4 py-2 text-white rounded-lg ${card.btnColor}`}>
              {card.action}
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ManageList;
