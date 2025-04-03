interface DashboardCardsProps {
    stats: {
      users: number;
      products: number;
      featuredProducts?: number;
      outOfStockProducts?: number;
    };
  }
  
  export default function DashboardCards({ stats }: DashboardCardsProps) {
    const cards = [
      {
        title: "Jami Foydalanuvchilar",
        value: stats.users,
        icon: "👥",
        bgColor: "bg-blue-100",
        textColor: "text-blue-600"
      },
      {
        title: "Jami Mahsulotlar",
        value: stats.products,
        icon: "🛍️",
        bgColor: "bg-green-100",
        textColor: "text-green-600"
      },
      {
        title: "Tugagan Mahsulotlar",
        value: stats.outOfStockProducts || 0,
        icon: "⚠️",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-600"
      },
      {
        title: "Tavsiya etilganlar",
        value: stats.featuredProducts || 0,
        icon: "⭐",
        bgColor: "bg-purple-100",
        textColor: "text-purple-600"
      }
    ];
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className={`p-6 rounded-lg shadow ${card.bgColor} ${card.textColor}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{card.title}</p>
                <p className="text-2xl font-bold mt-2">{card.value}</p>
              </div>
              <span className="text-3xl">{card.icon}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }