fetch('../data/news.json')
  .then(response => response.json())
  .then(data => {
    let newsItems = document.getElementById("news-items");
    let newsItemsOld = document.getElementById("news-items-old");
    newsItems.innerHTML = "";
    newsItemsOld.innerHTML = "";

    data.newsItems.forEach((item, index) => {
      let li = document.createElement("li");
      let content = item.content;

      // Replace placeholders in content with actual links
      item.links.forEach(link => {
        content = content.replace(link.text, `<a href="${link.url}" target="_blank">${link.text}</a>`);
      });

      // Adding strong tag for date
      li.innerHTML = `<strong>[${item.date}]</strong>: ${content}`;

      newsItems.appendChild(li);
    });

    data.oldNewsItems.forEach((item, index) => {
      let li = document.createElement("li");
      let content = item.content;

      // Replace placeholders in content with actual links
      item.links.forEach(link => {
        content = content.replace(link.text, `<a href="${link.url}" target="_blank">${link.text}</a>`);
      });

      // Adding strong tag for date
      li.innerHTML = `<strong>[${item.date}]</strong>: ${content}`;

      newsItemsOld.appendChild(li);
    });
  })
  .catch((error) => {
    console.error('Error:', error);
  });
