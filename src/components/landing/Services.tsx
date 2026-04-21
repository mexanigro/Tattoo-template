import React, { useRef, useState } from "react";

type MenuCategory = "todos" | "calientes" | "frios" | "postres";

type MenuItem = {
  id: number;
  name: string;
  category: Exclude<MenuCategory, "todos">;
  price: string;
  description: string;
  color: string;
};

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Espresso Clasico",
    category: "calientes",
    price: "$3.50",
    description: "Intenso, cremoso y con cuerpo. El alma del cafe.",
    color: "#3E2723",
  },
  {
    id: 2,
    name: "Cappuccino Soft",
    category: "calientes",
    price: "$4.20",
    description: "Espuma de nube sobre espresso doble.",
    color: "#6F4E37",
  },
  {
    id: 3,
    name: "Cold Brew",
    category: "frios",
    price: "$4.50",
    description: "12 horas de extraccion fria. Suave y dulce.",
    color: "#4E342E",
  },
  {
    id: 4,
    name: "Flat White",
    category: "calientes",
    price: "$4.00",
    description: "Microespuma sedosa sobre doble ristretto.",
    color: "#5D4037",
  },
  {
    id: 5,
    name: "Iced Latte",
    category: "frios",
    price: "$4.80",
    description: "Hielo, leche cremosa y espresso balanceado.",
    color: "#8D6E63",
  },
  {
    id: 6,
    name: "Tiramisu Casero",
    category: "postres",
    price: "$5.50",
    description: "Capas de cafe, mascarpone y cacao.",
    color: "#3E2723",
  },
  {
    id: 7,
    name: "Cheesecake de Caramelo",
    category: "postres",
    price: "$5.00",
    description: "Base de galleta, queso y salsa de caramelo salado.",
    color: "#6F4E37",
  },
  {
    id: 8,
    name: "Frappe Moka",
    category: "frios",
    price: "$5.20",
    description: "Batido de cafe, chocolate y crema montada.",
    color: "#4E342E",
  },
];

const categories: { key: MenuCategory; label: string }[] = [
  { key: "todos", label: "Todo" },
  { key: "calientes", label: "Calientes" },
  { key: "frios", label: "Frios" },
  { key: "postres", label: "Postres" },
];

const MenuCard = ({ item }: { item: MenuItem }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 12;
    const rotateY = (centerX - x) / 12;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
    }
  };

  return (
    <div
      className="transition-all duration-500 ease-out"
      style={{
        opacity: 1,
        transform: "translateY(0) scale(1)",
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative h-full cursor-pointer overflow-hidden rounded-2xl border border-[#3E2723] bg-[#2C1810] p-6 transition-transform duration-200 ease-out will-change-transform md:p-8"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ boxShadow: `0 0 40px ${item.color}20, inset 0 0 60px ${item.color}10` }}
        />

        <div
          className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-10 blur-2xl transition-transform duration-500 group-hover:scale-150"
          style={{ background: item.color }}
        />

        <div className="relative z-10">
          <div className="mb-4 flex items-start justify-between">
            <span className="rounded-full border border-[#3E2723] px-3 py-1 text-[10px] uppercase tracking-[3px] text-[#8D6E63]">
              {item.category}
            </span>
            <span className="text-xl font-light text-[#D4A574]">{item.price}</span>
          </div>

          <h3 className="mb-3 text-2xl font-light leading-tight text-[#F5E6D3] md:text-3xl">
            {item.name}
          </h3>

          <p className="text-sm leading-relaxed text-[#8D6E63] md:text-base">{item.description}</p>

          <div className="mt-6 flex translate-y-2 items-center gap-2 text-xs uppercase tracking-[2px] text-[#D4A574] opacity-0 transition-opacity duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span>Agregar al pedido</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export function Services({ onBookClick: _onBookClick }: { onBookClick: () => void }) {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("todos");
  const [isAnimating, setIsAnimating] = useState(false);

  const filteredItems =
    activeCategory === "todos"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  const handleCategoryChange = (cat: MenuCategory) => {
    if (cat === activeCategory) return;
    setIsAnimating(true);
    window.setTimeout(() => {
      setActiveCategory(cat);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <section id="menu" className="relative overflow-hidden bg-[#F5E6D3] px-4 py-24 md:px-8 md:py-32">
      <style>{`
        @keyframes fadeInUpMenu {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .menu-item-enter {
          animation: fadeInUpMenu 0.5s ease forwards;
        }
      `}</style>

      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="mb-4 text-xs uppercase tracking-[6px] text-[#6F4E37]">Nuestra Carta</p>
          <h2 className="mb-6 text-4xl font-light text-[#2C1810] md:text-6xl">
            Sabores que <span className="italic text-[#6F4E37]">perduran</span>
          </h2>
          <p className="mx-auto max-w-xl text-base text-[#6F4E37] md:text-lg">
            Cada bebida es una ceremonia. Cada postre, un cierre perfecto.
          </p>
        </div>

        <div className="mb-16 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleCategoryChange(cat.key)}
              className={`relative overflow-hidden rounded-full px-6 py-3 text-xs uppercase tracking-[3px] transition-all duration-300 ${
                activeCategory === cat.key
                  ? "bg-[#2C1810] text-[#F5E6D3]"
                  : "border border-[#2C1810]/20 bg-transparent text-[#2C1810] hover:border-[#2C1810]/60"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div
          className={`grid grid-cols-1 gap-6 transition-all duration-300 md:grid-cols-2 lg:grid-cols-4 ${
            isAnimating ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="menu-item-enter"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <MenuCard item={item} />
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="py-20 text-center text-[#6F4E37]">
            <p className="text-lg">No hay items en esta categoria.</p>
          </div>
        )}
      </div>
    </section>
  );
}
