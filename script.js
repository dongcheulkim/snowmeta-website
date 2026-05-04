// 스무스 스크롤
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 폼 제출 처리
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('상담 신청이 접수되었습니다.\n빠른 시일 내에 연락드리겠습니다.');
        this.reset();
    });
}

// 스크롤 애니메이션
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 카드 요소들에 애니메이션 적용
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.about-card, .branch-card, .team-card, .pricing-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // 홈페이지 reveal 요소 (V2)
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length > 0) {
        const revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach((entry, idx) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('visible'), idx * 60);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        revealEls.forEach(el => revealObserver.observe(el));
    }
});

// 네비게이션 스크롤 효과
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// 소속선수 필터 기능
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const teamCards = document.querySelectorAll('.team-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');

                // 활성 버튼 변경
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // 카드 필터링
                teamCards.forEach(card => {
                    const category = card.getAttribute('data-category');

                    if (filter === 'all') {
                        card.classList.remove('hidden');
                    } else if (filter === 'ski') {
                        // 스키는 board를 제외한 모든 카테고리
                        if (category !== 'board') {
                            card.classList.remove('hidden');
                        } else {
                            card.classList.add('hidden');
                        }
                    } else {
                        if (category === filter) {
                            card.classList.remove('hidden');
                        } else {
                            card.classList.add('hidden');
                        }
                    }
                });
            });
        });
    }

    // 팀원 카드 클릭 이벤트
    teamCards.forEach(card => {
        card.addEventListener('click', function() {
            const name = this.querySelector('h3').textContent;
            const role = this.querySelector('.team-role').textContent;
            const exp = this.querySelector('.team-exp') ? this.querySelector('.team-exp').textContent : '';
            const details = this.querySelector('.team-detail');

            let detailsHTML = '';
            if (details) {
                const detailItems = details.querySelectorAll('p');
                detailsHTML = '<ul>';
                detailItems.forEach(item => {
                    const text = item.textContent.replace('• ', '');
                    detailsHTML += `<li>${text}</li>`;
                });
                detailsHTML += '</ul>';
            }

            // 사진 가져오기
            const photoElement = this.querySelector('.team-photo img');
            let photos = [];
            let isImage = false;
            let mainPhoto = null;

            // data-photos 속성이 있는지 확인 (여러 사진)
            const photosData = this.getAttribute('data-photos');
            if (photosData) {
                photos = JSON.parse(photosData);
                isImage = true;

                // 메인 카드 사진 가져오기
                if (photoElement) {
                    mainPhoto = photoElement.getAttribute('src');
                    // 메인 사진을 배열에서 제거하고 맨 앞에 추가
                    photos = photos.filter(p => p !== mainPhoto);
                    photos.unshift(mainPhoto);
                }
            } else if (photoElement) {
                // 실제 이미지가 있는 경우
                photos = [photoElement.getAttribute('src')];
                isImage = true;
            } else {
                // 이모지만 있는 경우
                const emoji = this.querySelector('.team-photo').textContent.trim();
                photos = [emoji];
            }

            let sliderHTML = `
                <div class="photo-slider">
                    <div class="slider-container">
                        ${photos.map(photo => `<div class="slider-image">${isImage ? `<img src="${photo}" alt="${name}" style="width: 100%; height: 100%; object-fit: cover;">` : photo}</div>`).join('')}
                    </div>
                    ${photos.length > 1 ? `
                        <button class="slider-btn prev">‹</button>
                        <button class="slider-btn next">›</button>
                        <div class="slider-indicators">
                            ${photos.map((_, i) => `<div class="indicator-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `;

            const modal = document.createElement('div');
            modal.className = 'team-modal';
            modal.innerHTML = `
                <div class="team-modal-content">
                    <span class="team-modal-close">&times;</span>
                    <div class="team-modal-wrapper">
                        <div class="team-modal-left">
                            ${sliderHTML}
                            <h2>${name}</h2>
                            <p class="team-modal-role">${role}</p>
                            ${exp ? `<p class="team-modal-exp">${exp}</p>` : ''}
                        </div>
                        <div class="team-modal-right">
                            <div class="team-modal-details">
                                <h3>이력 및 경력</h3>
                                ${detailsHTML}
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // 슬라이더 기능
            let currentIndex = 0;
            const sliderContainer = modal.querySelector('.slider-container');
            const prevBtn = modal.querySelector('.slider-btn.prev');
            const nextBtn = modal.querySelector('.slider-btn.next');
            const indicators = modal.querySelectorAll('.indicator-dot');

            function updateSlider() {
                if (sliderContainer) {
                    sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
                    indicators.forEach((dot, i) => {
                        dot.classList.toggle('active', i === currentIndex);
                    });
                }
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentIndex = (currentIndex - 1 + photos.length) % photos.length;
                    updateSlider();
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentIndex = (currentIndex + 1) % photos.length;
                    updateSlider();
                });
            }

            indicators.forEach((dot, i) => {
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentIndex = i;
                    updateSlider();
                });
            });

            setTimeout(() => modal.classList.add('active'), 10);

            const closeBtn = modal.querySelector('.team-modal-close');
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
                setTimeout(() => modal.remove(), 300);
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    setTimeout(() => modal.remove(), 300);
                }
            });
        });
    });

    // 정비 서비스 카드 클릭 이벤트
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('h4').textContent;
            const description = this.querySelector('p').textContent;

            let detailText = '';
            let photos = [];

            switch(title) {
                case '엣지 샤프닝':
                    photos = ['images/edge-sharpening-1.jpg', 'images/edge-sharpening-2.jpg', 'images/edge-sharpening-3.jpg'];
                    detailText = `
                        <h3>엣지 샤프닝</h3>
                        <p>정밀한 각도 조정으로 완벽한 그립감을 제공합니다.</p>
                        <ul>
                            <li>베이스 엣지: 0.5° ~ 1.5°</li>
                            <li>사이드 엣지: 85° ~ 90°</li>
                            <li>레이싱용 특수 각도 조정 가능</li>
                            <li>데뷰링 처리로 부드러운 턴 구현</li>
                        </ul>
                    `;
                    break;
                case '왁싱':
                    photos = ['images/waxing-1.jpg'];
                    detailText = `
                        <h3>왁싱</h3>
                        <p>설질과 온도에 맞는 최적의 활주면을 구현합니다.</p>
                        <ul>
                            <li>기온별 맞춤 왁스 선택</li>
                            <li>핫 왁싱 / 스프레이 왁싱</li>
                            <li>레이싱 왁스 적용 가능</li>
                            <li>스트럭처 작업 병행 가능</li>
                        </ul>
                    `;
                    break;
                case '베이스 수리':
                    photos = ['🛠️', '🔧', '⛷️', '✨'];
                    detailText = `
                        <h3>베이스 수리</h3>
                        <p>스크래치와 손상 부위를 완벽하게 복구합니다.</p>
                        <ul>
                            <li>P-TEX 보수</li>
                            <li>코어샷 수리</li>
                            <li>베이스 그라인딩</li>
                            <li>플랫 & 스트럭처 작업</li>
                        </ul>
                    `;
                    break;
                case '바인딩 세팅':
                    photos = ['images/binding-setting-1.jpg', 'images/binding-setting-2.jpg', 'images/binding-setting-3.jpg'];
                    detailText = `
                        <h3>바인딩 세팅</h3>
                        <p>개인별 맞춤 안전한 세팅을 제공합니다.</p>
                        <ul>
                            <li>DIN 값 정밀 조정</li>
                            <li>스탠스 폭 조절</li>
                            <li>앵글 맞춤 세팅</li>
                            <li>안전 점검 및 테스트</li>
                        </ul>
                    `;
                    break;
                case '탑시트 제거':
                    photos = ['📋', '✨', '🎿', '⛷️'];
                    detailText = `
                        <h3>탑시트 제거</h3>
                        <p>깔끔한 탑시트 제거로 새로운 느낌을 연출합니다.</p>
                        <ul>
                            <li>손상 없는 정밀 제거 작업</li>
                            <li>표면 마감 처리</li>
                            <li>코어 보호 작업</li>
                            <li>커스텀 래핑 상담 가능</li>
                        </ul>
                    `;
                    break;
            }

            // 이미지 파일인지 확인 (이모지가 아닌지)
            const isImage = photos.length > 0 && photos[0].includes('.');

            let sliderHTML = `
                <div class="photo-slider">
                    <div class="slider-container">
                        ${photos.map(photo => `<div class="slider-image">${isImage ? `<img src="${photo}" alt="${title}" style="width: 100%; height: 100%; object-fit: contain;">` : photo}</div>`).join('')}
                    </div>
                    ${photos.length > 1 ? `
                        <button class="slider-btn prev">‹</button>
                        <button class="slider-btn next">›</button>
                        <div class="slider-indicators">
                            ${photos.map((_, i) => `<div class="indicator-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `;

            const modal = document.createElement('div');
            modal.className = 'service-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="modal-close">&times;</span>
                    ${sliderHTML}
                    ${detailText}
                </div>
            `;

            document.body.appendChild(modal);

            // 슬라이더 기능
            let currentIndex = 0;
            const sliderContainer = modal.querySelector('.slider-container');
            const prevBtn = modal.querySelector('.slider-btn.prev');
            const nextBtn = modal.querySelector('.slider-btn.next');
            const indicators = modal.querySelectorAll('.indicator-dot');

            function updateSlider() {
                if (sliderContainer) {
                    sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
                    indicators.forEach((dot, i) => {
                        dot.classList.toggle('active', i === currentIndex);
                    });
                }
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentIndex = (currentIndex - 1 + photos.length) % photos.length;
                    updateSlider();
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentIndex = (currentIndex + 1) % photos.length;
                    updateSlider();
                });
            }

            indicators.forEach((dot, i) => {
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentIndex = i;
                    updateSlider();
                });
            });

            setTimeout(() => modal.classList.add('active'), 10);

            const closeBtn = modal.querySelector('.modal-close');
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
                setTimeout(() => modal.remove(), 300);
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    setTimeout(() => modal.remove(), 300);
                }
            });
        });
    });
});
