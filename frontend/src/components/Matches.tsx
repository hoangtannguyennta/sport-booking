import { LocationIcon, CalendarIcon, ClockIcon, UsersIcon, ArrowRightIcon } from "./icons/Icons";


const Matches = () => {
    return (
      <>
      <main className="main-matches">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-matches">
          <h2>Các trận sắp diễn ra</h2>
          <span className="match-count">5 trận</span>
        </div>

        {/* Match Cards Grid */}
        <div className="match-grid">

          {/* Match Card 1 */}
          <article className="match-card">
            <div className="match-card-header">
              <div className="venue-info">
                <h3 className="venue-name">Sân Cầu Lông Phú Nhuận</h3>
                <p className="venue-address">
                  <LocationIcon />
                  123 Phan Xích Long, Q. Phú Nhuận
                </p>
              </div>

              <span className="status-badge status-almost-full">
                <span className="status-dot" />
                Sắp đủ người
              </span>
            </div>

            <div className="match-meta">
              <span className="meta-item">
                <CalendarIcon />
                T4, 05 Th02
              </span>
              <span className="meta-item">
                <ClockIcon />
                18:00 - 20:00
              </span>
              <span className="meta-item meta-warning">
                <UsersIcon />
                3/4 người
              </span>
            </div>

            <div className="match-card-footer">
              <div className="footer-left">
                <span className="skill-badge skill-intermediate">Trung bình</span>
                <div className="player-avatars">
                  <div className="avatar avatar-host">NA</div>
                  <div className="avatar">LC</div>
                  <div className="avatar">PD</div>
                </div>
              </div>

              <span className="join-hint">
                Tham gia <ArrowRightIcon />
              </span>
            </div>

            <span className="spots-badge">Còn 1 chỗ</span>
          </article>

          {/* Match Card 2 */}
          <article className="match-card">
            <div className="match-card-header">
              <div className="venue-info">
                <h3 className="venue-name">CLB Cầu Lông Tân Bình</h3>
                <p className="venue-address">
                  <LocationIcon />
                  456 Cộng Hoà, Q. Tân Bình
                </p>
              </div>

              <span className="status-badge status-looking">
                <span className="status-dot" />
                Đang tìm người
              </span>
            </div>

            <div className="match-meta">
              <span className="meta-item">
                <CalendarIcon />
                T4, 05 Th02
              </span>
              <span className="meta-item">
                <ClockIcon />
                19:00 - 21:00
              </span>
              <span className="meta-item">
                <UsersIcon />
                2/6 người
              </span>
            </div>

            <div className="match-card-footer">
              <div className="footer-left">
                <span className="skill-badge skill-beginner">Mới chơi</span>
                <div className="player-avatars">
                  <div className="avatar avatar-host">TB</div>
                  <div className="avatar">HE</div>
                </div>
              </div>

              <span className="join-hint">
                Tham gia <ArrowRightIcon />
              </span>
            </div>
          </article>

          {/* Match Card 3 */}
          <article className="match-card">
            <div className="match-card-header">
              <div className="venue-info">
                <h3 className="venue-name">Sân Thể Thao Quận 7</h3>
                <p className="venue-address">
                  <LocationIcon />
                  789 Nguyễn Thị Thập, Q. 7
                </p>
              </div>

              <span className="status-badge status-full">Đủ người</span>
            </div>

            <div className="match-meta">
              <span className="meta-item">
                <CalendarIcon />
                T5, 06 Th02
              </span>
              <span className="meta-item">
                <ClockIcon />
                06:00 - 08:00
              </span>
              <span className="meta-item">
                <UsersIcon />
                4/4 người
              </span>
            </div>

            <div className="match-card-footer">
              <div className="footer-left">
                <span className="skill-badge skill-advanced">Nâng cao</span>
                <div className="player-avatars">
                  <div className="avatar avatar-host">PD</div>
                  <div className="avatar">NA</div>
                  <div className="avatar">LC</div>
                  <div className="avatar">VF</div>
                </div>
              </div>
            </div>
          </article>

          {/* Match Card 4 */}
          <article className="match-card">
            <div className="match-card-header">
              <div className="venue-info">
                <h3 className="venue-name">Nhà Thi Đấu Quận 1</h3>
                <p className="venue-address">
                  <LocationIcon />
                  321 Nguyễn Đình Chiểu, Q. 1
                </p>
              </div>

              <span className="status-badge status-started">
                <span className="status-dot" />
                Đang diễn ra
              </span>
            </div>

            <div className="match-meta">
              <span className="meta-item">
                <CalendarIcon />
                Hôm nay
              </span>
              <span className="meta-item">
                <ClockIcon />
                20:00 - 22:00
              </span>
              <span className="meta-item">
                <UsersIcon />
                4/4 người
              </span>
            </div>

            <div className="match-card-footer">
              <div className="footer-left">
                <span className="skill-badge skill-intermediate">Trung bình</span>
                <div className="player-avatars">
                  <div className="avatar avatar-host">LC</div>
                  <div className="avatar">NA</div>
                  <div className="avatar">TB</div>
                  <div className="avatar">VF</div>
                </div>
              </div>
            </div>
          </article>

          {/* Match Card 5 */}
          <article className="match-card match-card-ended">
            <div className="match-card-header">
              <div className="venue-info">
                <h3 className="venue-name">Sân Cầu Lông Gò Vấp</h3>
                <p className="venue-address">
                  <LocationIcon />
                  654 Quang Trung, Q. Gò Vấp
                </p>
              </div>

              <span className="status-badge status-ended">Đã kết thúc</span>
            </div>

            <div className="match-meta">
              <span className="meta-item">
                <CalendarIcon />
                Hôm qua
              </span>
              <span className="meta-item">
                <ClockIcon />
                17:00 - 19:00
              </span>
              <span className="meta-item">
                <UsersIcon />
                6/6 người
              </span>
            </div>

            <div className="match-card-footer">
              <div className="footer-left">
                <span className="skill-badge skill-all">Mọi trình độ</span>
                <div className="player-avatars">
                  <div className="avatar avatar-host">HE</div>
                  <div className="avatar">NA</div>
                  <div className="avatar">TB</div>
                  <span className="avatar-more">+3</span>
                </div>
              </div>
            </div>
          </article>

        </div>
      </div>
    </main>
    </>
  );
}

export default Matches;