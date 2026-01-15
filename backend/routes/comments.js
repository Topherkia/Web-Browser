class CommentSystem {
    constructor() {
        this.serverUrl = 'http://localhost:3000';
        this.comments = [];
        this.currentUrl = '';
    }

    async saveComment(name, rating, comment) {
        try {
            const response = await fetch(`${this.serverUrl}/save-comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    rating: rating,
                    comment: comment,
                    url: this.currentUrl
                })
            });

            const result = await response.json();
            
            if (result.success) {
                console.log('✅ Comment saved:', result);
                this.loadComments(); // Reload comments
                return true;
            } else {
                console.error('❌ Failed to save:', result.message);
                return false;
            }
        } catch (error) {
            console.error('❌ Network error:', error);
            return false;
        }
    }

    async loadComments() {
        try {
            if (!this.currentUrl) return;
            
            const response = await fetch(`${this.serverUrl}/get-comments?url=${encodeURIComponent(this.currentUrl)}`);
            const result = await response.json();
            
            if (result.success) {
                this.comments = result.data;
                this.displayComments();
                console.log(`✅ Loaded ${this.comments.length} comments`);
            }
        } catch (error) {
            console.error('❌ Error loading comments:', error);
            // Fallback to local storage if server is down
            this.loadFromLocalStorage();
        }
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem(`comments_${this.currentUrl}`);
        if (saved) {
            this.comments = JSON.parse(saved);
            this.displayComments();
        }
    }

    displayComments() {
        const container = document.getElementById('previousComments');
        if (!container) return;

        if (this.comments.length === 0) {
            container.innerHTML = '<p>No comments yet. Be the first!</p>';
            return;
        }

        container.innerHTML = this.comments.map(comment => `
            <div class="comment-item">
                <div class="comment-header">
                    <strong>${this.escapeHtml(comment.name)}</strong>
                    <span class="rating">⭐ ${comment.rating}/5</span>
                </div>
                <p class="comment-text">${this.escapeHtml(comment.comment)}</p>
                <small class="comment-time">${new Date(comment.timestamp).toLocaleString()}</small>
            </div>
        `).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setCurrentUrl(url) {
        this.currentUrl = url;
        console.log('🌐 Current URL set to:', url);
        this.loadComments();
    }

    // Test connection
    async testConnection() {
        try {
            const response = await fetch(`${this.serverUrl}/test-db`);
            const result = await response.json();
            console.log('🔗 Connection test:', result);
            return result.success;
        } catch (error) {
            console.error('❌ Connection test failed:', error);
            return false;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.commentSystem = new CommentSystem();
    
    // Test connection on startup
    setTimeout(() => {
        window.commentSystem.testConnection();
    }, 1000);
});