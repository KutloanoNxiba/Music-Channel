document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    const mobileLinks = document.querySelectorAll('.mobile-menu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Artist card play buttons
    const playButtons = document.querySelectorAll('.play-btn');
    let currentlyPlaying = null;
    
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const audioId = this.getAttribute('data-audio');
            const audio = document.getElementById(audioId);
            
            if (currentlyPlaying && currentlyPlaying !== audio) {
                currentlyPlaying.pause();
                currentlyPlaying.currentTime = 0;
                const prevButton = document.querySelector(`.play-btn[data-audio="${currentlyPlaying.id}"]`);
                prevButton.innerHTML = '<i class="fas fa-play"></i>';
            }
            
            if (audio.paused) {
                audio.play();
                this.innerHTML = '<i class="fas fa-pause"></i>';
                currentlyPlaying = audio;
            } else {
                audio.pause();
                this.innerHTML = '<i class="fas fa-play"></i>';
                currentlyPlaying = null;
            }
            
            audio.addEventListener('ended', function() {
                button.innerHTML = '<i class="fas fa-play"></i>';
                currentlyPlaying = null;
            });
        });
    });
    
    // Music player functionality
    const musicPlayer = {
        audio: new Audio(),
        currentTrack: 0,
        tracks: document.querySelectorAll('.playlist .track'),
        isPlaying: false,
        init: function() {
            this.setupEventListeners();
            this.loadTrack(0);
        },
        setupEventListeners: function() {
            // Play/Pause button
            const playPauseBtn = document.querySelector('.play-pause');
            playPauseBtn.addEventListener('click', () => this.togglePlay());
            
            // Next button
            const nextBtn = document.querySelector('.next');
            nextBtn.addEventListener('click', () => this.nextTrack());
            
            // Previous button
            const prevBtn = document.querySelector('.prev');
            prevBtn.addEventListener('click', () => this.prevTrack());
            
            // Track click
            this.tracks.forEach((track, index) => {
                track.addEventListener('click', () => {
                    this.currentTrack = index;
                    this.loadTrack(index);
                    this.playTrack();
                });
            });
            
            // Progress bar
            const progressContainer = document.querySelector('.progress-container');
            progressContainer.addEventListener('click', (e) => {
                const width = progressContainer.clientWidth;
                const clickX = e.offsetX;
                const duration = this.audio.duration;
                this.audio.currentTime = (clickX / width) * duration;
            });
            
            // Volume control
            const volumeSlider = document.querySelector('.volume-slider');
            volumeSlider.addEventListener('input', () => {
                this.audio.volume = volumeSlider.value;
            });
            
            // Time update
            this.audio.addEventListener('timeupdate', () => this.updateProgress());
            
            // Track ends
            this.audio.addEventListener('ended', () => this.nextTrack());
        },
        loadTrack: function(index) {
            const track = this.tracks[index];
            const audioSrc = track.getAttribute('data-src');
            
            // Update UI
            this.tracks.forEach(t => t.classList.remove('active'));
            track.classList.add('active');
            
            // Update track info
            const trackTitle = track.querySelector('h5').textContent;
            const trackArtist = track.querySelector('p').textContent;
            document.querySelector('.track-title').textContent = trackTitle;
            document.querySelector('.track-artist').textContent = trackArtist;
            
            // Load audio
            this.audio.src = audioSrc;
            this.audio.load();
        },
        playTrack: function() {
            this.audio.play();
            this.isPlaying = true;
            document.querySelector('.play-pause i').className = 'fas fa-pause';
        },
        pauseTrack: function() {
            this.audio.pause();
            this.isPlaying = false;
            document.querySelector('.play-pause i').className = 'fas fa-play';
        },
        togglePlay: function() {
            if (this.isPlaying) {
                this.pauseTrack();
            } else {
                this.playTrack();
            }
        },
        nextTrack: function() {
            this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
            this.loadTrack(this.currentTrack);
            this.playTrack();
        },
        prevTrack: function() {
            this.currentTrack = (this.currentTrack - 1 + this.tracks.length) % this.tracks.length;
            this.loadTrack(this.currentTrack);
            this.playTrack();
        },
        updateProgress: function() {
            const progressBar = document.querySelector('.progress-bar');
            const currentTime = document.querySelector('.current-time');
            const duration = document.querySelector('.duration');
            
            // Update progress bar
            const progressPercent = (this.audio.currentTime / this.audio.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
            
            // Update time
            const currentMinutes = Math.floor(this.audio.currentTime / 60);
            const currentSeconds = Math.floor(this.audio.currentTime % 60).toString().padStart(2, '0');
            currentTime.textContent = `${currentMinutes}:${currentSeconds}`;
            
            // Update duration
            if (!isNaN(this.audio.duration)) {
                const durationMinutes = Math.floor(this.audio.duration / 60);
                const durationSeconds = Math.floor(this.audio.duration % 60).toString().padStart(2, '0');
                duration.textContent = `${durationMinutes}:${durationSeconds}`;
            }
        }
    };
    
    musicPlayer.init();
    
    // Testimonial slider
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentTestimonial = index;
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showTestimonial(index));
    });
    
    prevBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentTestimonial);
    });
    
    nextBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    });
    
    // Show first testimonial initially
    showTestimonial(0);
    
    // Auto-advance testimonials
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);
    
    // Global audio player
    const globalPlayer = {
        audio: new Audio(),
        currentTrack: 0,
        isPlaying: false,
        init: function() {
            this.setupEventListeners();
            this.syncWithMainPlayer();
        },
        setupEventListeners: function() {
            // Play/Pause button
            const playPauseBtn = document.querySelector('.global-audio-player .play-pause');
            playPauseBtn.addEventListener('click', () => this.togglePlay());
            
            // Next button
            const nextBtn = document.querySelector('.global-audio-player .next');
            nextBtn.addEventListener('click', () => {
                musicPlayer.nextTrack();
                this.syncWithMainPlayer();
            });
            
            // Previous button
            const prevBtn = document.querySelector('.global-audio-player .prev');
            prevBtn.addEventListener('click', () => {
                musicPlayer.prevTrack();
                this.syncWithMainPlayer();
            });
            
            // Progress bar
            const progressContainer = document.querySelector('.global-audio-player .progress-bar-container');
            progressContainer.addEventListener('click', (e) => {
                const width = progressContainer.clientWidth;
                const clickX = e.offsetX;
                const duration = this.audio.duration;
                this.audio.currentTime = (clickX / width) * duration;
                musicPlayer.audio.currentTime = this.audio.currentTime;
            });
            
            // Volume control
            const volumeSlider = document.querySelector('.global-audio-player .volume-slider');
            volumeSlider.addEventListener('input', () => {
                this.audio.volume = volumeSlider.value;
                musicPlayer.audio.volume = volumeSlider.value;
            });
            
            // Time update
            this.audio.addEventListener('timeupdate', () => this.updateProgress());
            
            // Like button
            const likeBtn = document.querySelector('.player-like-btn');
            likeBtn.addEventListener('click', function() {
                this.classList.toggle('liked');
            });
        },
        syncWithMainPlayer: function() {
            // Sync track info
            const trackTitle = document.querySelector('.track-title').textContent;
            const trackArtist = document.querySelector('.track-artist').textContent;
            document.querySelector('.player-track-title').textContent = trackTitle;
            document.querySelector('.player-track-artist').textContent = trackArtist;
            
            // Sync audio
            this.audio.src = musicPlayer.audio.src;
            this.audio.volume = musicPlayer.audio.volume;
            
            if (musicPlayer.isPlaying) {
                this.playTrack();
            } else {
                this.pauseTrack();
            }
            
            // Show global player
            document.querySelector('.global-audio-player').classList.add('active');
        },
        playTrack: function() {
            this.audio.play();
            this.isPlaying = true;
            document.querySelector('.global-audio-player .play-pause i').className = 'fas fa-pause';
        },
        pauseTrack: function() {
            this.audio.pause();
            this.isPlaying = false;
            document.querySelector('.global-audio-player .play-pause i').className = 'fas fa-play';
        },
        togglePlay: function() {
            if (this.isPlaying) {
                this.pauseTrack();
                musicPlayer.pauseTrack();
            } else {
                this.playTrack();
                musicPlayer.playTrack();
            }
        },
        updateProgress: function() {
            const progressBar = document.querySelector('.global-audio-player .progress-bar');
            const currentTime = document.querySelector('.global-audio-player .player-current-time');
            const duration = document.querySelector('.global-audio-player .player-duration');
            
            // Update progress bar
            const progressPercent = (this.audio.currentTime / this.audio.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
            
            // Update time
            const currentMinutes = Math.floor(this.audio.currentTime / 60);
            const currentSeconds = Math.floor(this.audio.currentTime % 60).toString().padStart(2, '0');
            currentTime.textContent = `${currentMinutes}:${currentSeconds}`;
            
            // Update duration
            if (!isNaN(this.audio.duration)) {
                const durationMinutes = Math.floor(this.audio.duration / 60);
                const durationSeconds = Math.floor(this.audio.duration % 60).toString().padStart(2, '0');
                duration.textContent = `${durationMinutes}:${durationSeconds}`;
            }
        }
    };
    
    // Initialize global player when a track is played in the main player
    const mainPlayPauseBtn = document.querySelector('.music-player .play-pause');
    mainPlayPauseBtn.addEventListener('click', () => {
        if (musicPlayer.isPlaying) {
            globalPlayer.init();
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Genre tabs
    const genreTabs = document.querySelectorAll('.genre-tab');
    genreTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            genreTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            // In a real app, you would filter content based on the selected genre
        });
    });
});
