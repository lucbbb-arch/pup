// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 1. 导航栏滚动效果
    const header = document.getElementById('header');
    const setScroll = () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    setScroll();
    window.addEventListener('scroll', setScroll);
    
    // 2. 移动端导航菜单
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuBtn.classList.toggle('active');
            
            // 切换菜单图标
            const icon = menuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // 点击导航链接后关闭菜单（移动端）
        const navLinksItems = navLinks.querySelectorAll('a');
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 480) {
                    navLinks.classList.remove('active');
                    const icon = menuBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }
    
    // 3. 视频播放逻辑
    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        // 设置视频播放属性
        heroVideo.setAttribute('muted', 'true');
        heroVideo.setAttribute('playsinline', 'true');
        heroVideo.setAttribute('webkit-playsinline', 'true');
        
        // 尝试自动播放
        const playPromise = heroVideo.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('视频自动播放被阻止:', error);
                // 添加用户交互后播放
                document.addEventListener('click', function playVideo() {
                    heroVideo.play();
                    document.removeEventListener('click', playVideo);
                }, { once: true });
            });
        }
        
        // 调试模式
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('debug') === '1') {
            heroVideo.setAttribute('controls', 'true');
        }
    }
    
    // 4. 当前页面导航链接高亮
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinkElements = document.querySelectorAll('.nav-link');
    
    navLinkElements.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === 'index.html' && linkHref === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // 5. 页面元素动画
    function animateOnScroll() {
        const elements = document.querySelectorAll('.service-card, .case-link');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // 设置初始状态
    const animatedElements = document.querySelectorAll('.service-card, .case-link');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // 监听滚动
    window.addEventListener('scroll', animateOnScroll);
    
    // 初始化检查
    setTimeout(animateOnScroll, 100);
    
    // 6. Logo墙悬停效果
    const logoWall = document.querySelector('.logo-wall');
    if (logoWall) {
        logoWall.addEventListener('mouseenter', () => {
            logoWall.style.transform = 'scale(1)';
        });
        
        logoWall.addEventListener('mouseleave', () => {
            logoWall.style.transform = 'scale(1)';
        });
    }
    
    // 7. 窗口大小变化处理
    window.addEventListener('resize', () => {
        // 如果窗口变大，隐藏移动端菜单
        if (window.innerWidth > 480 && navLinks) {
            navLinks.classList.remove('active');
            if (menuBtn) {
                const icon = menuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
});

// 全局辅助函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 平滑滚动到锚点
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// 页面加载动画
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // 添加加载完成的样式
    setTimeout(() => {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--bg-section);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 1;
            transition: opacity 0.5s ease;
        `;
        
        loader.innerHTML = `
            <div style="text-align: center;">
                <div style="width: 50px; height: 50px; border: 3px solid var(--brand-purple); border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <p style="margin-top: 20px; color: var(--text-primary);">加载中...</p>
            </div>
        `;
        
        document.body.appendChild(loader);
        
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 500);
        }, 1000);
    }, 100);
});

// 案例页面特定功能
if (window.location.pathname.includes('cases.html')) {
    // 案例筛选功能
    const filterBtns = document.querySelectorAll('.filter-btn');
    const caseItems = document.querySelectorAll('.case-item');
    
    if (filterBtns.length > 0 && caseItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // 移除所有按钮的active类
                filterBtns.forEach(b => b.classList.remove('active'));
                
                // 为当前按钮添加active类
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // 筛选案例
                caseItems.forEach(item => {
                    const categories = item.getAttribute('data-category');
                    
                    if (filterValue === 'all' || categories.includes(filterValue)) {
                        item.style.display = 'block';
                        // 添加淡入动画
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        // 添加淡出动画
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    // 加载更多功能
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载中...';
            this.disabled = true;
            
            // 模拟加载延迟
            setTimeout(() => {
                // 这里可以添加AJAX请求来加载更多案例
                // 暂时显示提示信息
                this.innerHTML = '<i class="fas fa-check"></i> 已加载全部案例';
                this.style.opacity = '0.5';
                this.style.cursor = 'default';
                
                // 显示加载完成的消息
                const message = document.createElement('div');
                message.className = 'load-complete';
                message.style.cssText = `
                    text-align: center;
                    color: var(--brand-purple-light);
                    margin-top: 20px;
                    font-size: 14px;
                `;
                message.textContent = '已显示全部案例';
                
                this.parentNode.appendChild(message);
                
                // 3秒后隐藏按钮
                setTimeout(() => {
                    this.style.display = 'none';
                }, 3000);
            }, 1500);
        });
    }
}

// 平滑滚动到筛选器位置
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const filterSection = document.querySelector('.case-filter');
        if (filterSection && window.innerWidth <= 768) {
            // 在移动端点击筛选后，平滑滚动到筛选器位置
            setTimeout(() => {
                filterSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
        }
    });
});