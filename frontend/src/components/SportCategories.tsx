type Sport = {
  name: string;
  count: string;
  icon: string;
  color: string;
};

const sports: Sport[] = [
  { name: "Bóng đá", count: "150+ sân", icon: "⚽", color: "#22c55e" },
  { name: "Tennis", count: "80+ sân", icon: "🎾", color: "#eab308" },
  { name: "Cầu lông", count: "120+ sân", icon: "🏸", color: "#3b82f6" },
  { name: "Bơi lội", count: "45+ hồ bơi", icon: "🏊", color: "#06b6d4" },
  { name: "Bóng rổ", count: "60+ sân", icon: "🏀", color: "#f97316" },
  { name: "Gym", count: "90+ phòng", icon: "🏋️", color: "#a855f7" },
];

const SportCategories = () => {
  return (
    <section className="section" id="sports">
      <div className="container">
        {/* Section header */}
        <div className="section-header">
          <span className="section-subtitle">Khám phá</span>
          <h2 className="section-title">Môn thể thao phổ biến</h2>
          <p className="section-description">
            Chọn môn thể thao yêu thích và tìm sân phù hợp nhất với bạn
          </p>
        </div>

        {/* Sports grid */}
        <div className="sports-grid">
          {sports.map((sport) => (
            <div
              key={sport.name}
              className="sport-card"
              style={{ "--sport-color": sport.color } as React.CSSProperties}
            >
              <div className="sport-icon">{sport.icon}</div>
              <h3>{sport.name}</h3>
              <p>{sport.count}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SportCategories;
