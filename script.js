const news_box = document.getElementById('news')
const top_news_card = document.getElementById('top_news_card')
const news_heading = document.getElementById('news_heading')
const API_KEY = '4f857569fdbe42879b62c31c727a79b8'; //Enter your API key here. Get from https://newsapi.org/
const loader = `<div class="d-flex justify-content-center mt-5">
<div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
</div>`

// ---------------------------------------------------Search Bar--------------------------------------------------------------------
function getData() {
    const search = document.getElementById('search_data').value
    if (search.length == 0) {
    } else {
        let newsHeading = search.charAt(0).toUpperCase() + search.slice(1)
        news_heading.innerHTML = 'You Search For ' + newsHeading;
        news_box.innerHTML = loader
        fetch(`https://newsapi.org/v2/everything?q=${search}&apiKey=${API_KEY}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok, status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                let news_info = data.articles
                news_box.innerHTML = ''
                if (news_info.length == 0) {
                    news_box.innerHTML = '<h1 class="text-center mt-5 text-danger">No Result Found!!!</h1>'
                } else {
                    news_info.forEach((news_info) => {
                        news_box.insertAdjacentHTML("beforeend", createnewscard(news_info));
                    });
                }

            })
            .catch(error => {
                console.error('Fetch error:', error);
                news_box.innerHTML = `<h1 class="text-center text-danger">Please Check Your Network Connection!!!</h1>`
            });
    }
}


// ------------------------------------------------Top Headlines-----------------------------------------------------------------
function top_News() {
    fetch(`https://newsapi.org/v2/top-headlines?country=in&pageSize=100&apiKey=${API_KEY}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok, status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            let top_news = data.articles
            top_news.forEach((top_news) => {
                top_news_card.insertAdjacentHTML("beforeend", topNewscard(top_news));
            });
        })
        .catch(error => {
            console.error('Fetch error:', error);
            top_news_card.innerHTML = `<h3 class="text-center text-danger">Please Check Your Network Connection!!!</h3>`
        });
}
top_News()

function topNewscard(top_news) {
    let title = top_news.title.slice(0, 120)
    let img = top_news.urlToImage ? top_news.urlToImage : "images/news-image.jpg";
    return `<a href="${top_news.url}" title="${top_news.source.name}" target="_blank"><div class="news-card">
    <img src="${img}" alt="img">
    <div>
        <p>${title}.</p>
    </div>
</div></a>`
}


// -----------------------------------------------------------------------Other News-----------------------------------------------------------

function changeMode() {
    let category = document.getElementById('category').value
    let country = document.getElementById('country').value
    fetch_News(category, country)
}

function fetch_News(category = 'general', country = 'in') {
    const search = document.getElementById('search_data')
    search.value = '';
    news_box.innerHTML = loader
    let newsHeading = category.charAt(0).toUpperCase() + category.slice(1)
    news_heading.innerHTML = newsHeading + ' News';
    fetch(`https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&pageSize=100&apiKey=${API_KEY}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok, status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            let news_info = data.articles
            news_box.innerHTML = '';
            news_info.forEach((news_info) => {
                news_box.insertAdjacentHTML("beforeend", createnewscard(news_info));
            });
        })
        .catch(error => {
            console.error('Fetch error:', error);
            news_box.innerHTML = `<h1 class="text-center text-danger">Please Check Your Network Connection!!!</h1>`
        });
}
fetch_News()


function createnewscard(news_info) {
    let title = '';
    if (news_info.title.length < 75) {
        title = news_info.title
    } else {
        title = news_info.title.slice(0, 75) + '...';
    }
    let description = '';
    if (news_info.description != null) {
        if (news_info.description.length < 160) {
            description = news_info.description;
        } else {
            description = news_info.description.slice(0, 160) + '...';
        }
    } else if (news_info.description == null) {
        description = '';
    } else {
        description = '';
    }
    let img = news_info.urlToImage ? news_info.urlToImage : "images/news-image.jpg";
    let author = '';
    if (news_info.author != null) {
        if (news_info.author.length < 16) {
            author = news_info.author
        } else {
            author = news_info.author.slice(0, 16) + '...';
        }
    } else {
        author = 'None';
    }
    let publishedAt = (new Date(news_info.publishedAt)).toLocaleDateString();
    return `<div class="col-md-3 mt-4">
        <div class="card shadow">
        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                ${news_info.source.name}
             <span class="visually-hidden">unread messages</span>
        </span>
        <img src="${img}" class="card-img-top" alt="img">
        <div class="card-body">
            <h6 class="card-title">${title}</h6>
            <p class="card-text">${description}</p>
            <div class="d-flex justify-content-between">
            <small class="text-secondary">Author: <span class="text-dark">${author}</span></small>
            <small class="text-end text-secondary">Date: <span class="text-success"><b>${publishedAt}</b></span></small><br>
            </div>
            <a href="${news_info.url}" class="btn btn-outline-danger btn-sm mt-2" target='_blank'>Read More</a>
        </div>
        </div>
    </div>`
}

