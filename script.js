// 评级顺序（固定）
const RATINGS = ["夯", "优秀", "良好", "还行", "拉"];

// 获取表格体和总数显示元素
const tbody = document.getElementById('rating-table-body');
const totalSpan = document.getElementById('total-count');

// 加载并渲染数据
async function loadAndRender() {
    try {
        const response = await fetch('novels.json');
        if (!response.ok) {
            throw new Error(`无法加载数据 (HTTP ${response.status})`);
        }
        const books = await response.json();

        // 简单验证：确保 books 是数组，并过滤掉无效条目
        if (!Array.isArray(books)) {
            throw new Error('数据格式错误，应为数组');
        }
        const validBooks = books.filter(b => b && typeof b.name === 'string' && RATINGS.includes(b.rating));

        // 更新总本书
        totalSpan.textContent = validBooks.length;

        renderTable(validBooks);
    } catch (error) {
        console.error('数据加载失败:', error);
        tbody.innerHTML = `
            <tr><td colspan="2" style="text-align:center; padding:2rem; background:transparent;">
                ⚠️ 无法加载小说数据，请确认 <code>novels.json</code> 文件存在且格式正确。<br>
                开发者工具 → Network 面板可查看具体请求状态。
            </td></tr>
        `;
        totalSpan.textContent = '0';
    }
}

// 渲染表格
function renderTable(books) {
    // 按评级分组
    const grouped = {};
    RATINGS.forEach(r => grouped[r] = []);

    books.forEach(book => {
        if (grouped.hasOwnProperty(book.rating)) {
            grouped[book.rating].push(book.name);
        } else {
            grouped["拉"].push(book.name);
        }
    });

    // 清空 tbody
    tbody.innerHTML = '';

    // 为每个评级创建一行
    RATINGS.forEach(rating => {
        const row = document.createElement('tr');

        // 第一列：评级名称
        const tdRating = document.createElement('td');
        tdRating.textContent = rating;
        row.appendChild(tdRating);

        // 第二列：小说列表（网格容器）
        const tdBooks = document.createElement('td');
        const bookListDiv = document.createElement('div');
        bookListDiv.className = 'book-list';

        const novels = grouped[rating] || [];

        if (novels.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'empty-books';
            emptyMsg.textContent = '📭 暂无小说';
            bookListDiv.appendChild(emptyMsg);
        } else {
            novels.forEach(title => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'book-item';
                itemDiv.textContent = title;
                bookListDiv.appendChild(itemDiv);
            });
        }

        tdBooks.appendChild(bookListDiv);
        row.appendChild(tdBooks);
        tbody.appendChild(row);
    });
}

// 页面加载后执行
window.addEventListener('DOMContentLoaded', loadAndRender);
