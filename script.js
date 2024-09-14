

const AddIt = document.getElementById('addpost')
const postInputForm = document.getElementById('user-input-form')
const form = document.getElementById('myform');
const input = document.getElementById('search');
const postContainer = document.querySelector('.post-container');
// storing all posts 
let allPosts = [];

// set the enter key to search 
input.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    searchPosts(input.value);
  }
});
// function for search posts it shows how  many are  in the same name i mean title 
function searchPosts(searchQuery) {

  const searchResults = [];

  allPosts.forEach((post) => {
    const title = post.querySelector('.title h3').textContent;
    if (title.toLowerCase().includes(searchQuery.toLowerCase())) {
      searchResults.push(post);
    }
  });

  if (searchResults.length > 0) {
    postContainer.innerHTML = ''; // clear the container
    searchResults.forEach((post) => {
      postContainer.appendChild(post);
    });
    // Add a "Back to Home" button
    const backButton = document.createElement('button');
    backButton.textContent = '<-';
    backButton.onclick = () => {
      showAllPosts();
      document.getElementById('title').value = '';
      document.getElementById('content').value = '';
      document.getElementById('imageFile').value = '';
      input.value = '';
    };
    backButton.className = 'back-button';
    postContainer.appendChild(backButton);
  } else {
    postContainer.innerHTML = '<p>null</p>'; // show "null" if no results found
    // Add a "Back to Home" button
    const backButton = document.createElement('button');
    backButton.textContent = '<-';
    backButton.onclick = () => {
      showAllPosts();
      document.getElementById('title').value = '';
      document.getElementById('content').value = '';
      document.getElementById('imageFile').value = '';
      input.value = '';
    };
    backButton.className = 'back-button';
    postContainer.appendChild(backButton);
  }
}
// shwoing all posts after user clicks on back button from a specified post 
function showAllPosts() {
  postContainer.innerHTML = ''; // clear the container
  allPosts.forEach((post) => {
    postContainer.appendChild(post);
  });
}
// initially making form clear input for post input
document.addEventListener('DOMContentLoaded',() =>{
  const posts = document.querySelectorAll('.post');
  allPosts = Array.from(posts);
  postInputForm.addEventListener('submit', (e) => {
   e.preventDefault();
     const userInput = {
      title:'',
      content:'',
      imageUrl:'',
      title: document.getElementById('title').value,
       content: document.getElementById('content').value,
       date:new Date().toLocaleDateString()
  };

  // If user uploaded an image, use the file URL instead of the text input
  const imageFile = document.getElementById('imageFile');
  if (imageFile.files.length > 0) {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      userInput.imageUrl = fileReader.result;
      createPost(userInput.imageUrl, userInput.title, userInput.content,userInput.date);
    };
    fileReader.readAsDataURL(imageFile.files[0]);
  } else {
    createPost(userInput.imageUrl, userInput.title, userInput.content,userInput.date);
    console.log('post created')
  }
});
})

// creating post using user input details 
function createPost(imageUrl, title, content, date) {
  const home = document.querySelector(".post-container")
  let imageSrc = imageUrl;
  if (!imageUrl) {
    imageSrc = 'https://satisfic.com/placeholder-589-png'; // default placeholder image
  }
  const postHTML = `
    <div class="post">
      <div class="image" style="margin-top:5px;">
        <img src="${imageUrl}" id="post"  alt="post" width="290px" height="180px">
      </div>
      <div class="title">
        <h3>${title}</h3>
      </div>
      
      <div class="comments hide">
     
        <p>${content}</p>
        <p>published Date::${date}</p>

        <h4>Comments</h4>
        <ul id="comment-list"></ul>
        <form id="comment-form">
          <input type="text" id="comment-name" placeholder="Name">
          <input type="text" id="comment-message" placeholder="Message">
          <button id="comment-submit">Submit</button>
        </form>
        <div class="social-share">
          <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" target="_blank">
            <i class="fab fa-facebook-f"></i>
          </a>
          <br><br>
          <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${title}" target="_blank">
            <i class="fab fa-twitter"></i>
          </a>
           <br><br>
          <a href="https://linkedin.com/shareArticle?url=${encodeURIComponent(window.location.href)}&title=${title}" target="_blank">
            <i class="fab fa-linkedin-in"></i>
          </a>
           <br><br>
          <a href="https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&description=${title}" target="_blank">
            <i class="fab fa-pinterest-p"></i>
          </a>
           <br><br>
           <button id="delete"> Delete</button>
        </div>
      </div>
    </div>
  `;
  // add the posts to post-container as child 
  home.insertAdjacentHTML('beforeend', postHTML);
  const newPost = home.lastElementChild;
  allPosts.push(newPost);
  // Toggle the visibility of the form
  postInputForm.style.display = postInputForm.style.display === 'none' ? 'block' : 'none';
  //toggle the visibillity of addpost div 
  //AddIt.style.display = AddIt.style.display === 'none' ? 'block' : 'none';
  // initializing comment form to enter comments by various users 
  const commentForm = newPost.querySelector('#comment-form');
  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const commentName = newPost.querySelector('#comment-name').value;
    const commentMessage = newPost.querySelector('#comment-message').value;
    addComment(newPost, commentName, commentMessage);
    newPost.querySelector('#comment-name').value = '';
    newPost.querySelector('#comment-message').value = '';
  });
  // Get the newly created post element
  const post = home.lastElementChild;
  // Add event listener to the image
  const image = post.querySelector('img');
  image.addEventListener('click', () => {
    const commentsDiv = post.querySelector('.comments');

    commentsDiv.classList.toggle ('hide');

    const backButton = post.querySelector('#back-button');
    backButton.addEventListener('click', () => {
      commentsDiv.classList.add('hide');
      post.classList.remove('active');
      // Show all other posts
      allPosts.forEach((p) => {
        p.classList.remove('hide');
      });
    });
    post.classList.add('active');
    // Hide all other posts
    allPosts.forEach((p) => {
      if (p !== post) {
        p.classList.add('hide');
      }
    });
  });

  const delButton  = post.querySelector('#delete');
  delButton.addEventListener('click',() =>{
    // removing post when  user clicks on delete option
    postContainer.removeChild(post);
    //remove the post from the all posts array
    const index = allPosts.indexOf(post);
    if (index !== -1) {
      allPosts.splice(index, 1);
    }
  })
}

function addComment(post, commentName, commentMessage) {
  const commentHTML = `
    <li>
      <p><strong>${commentName}</strong>: ${commentMessage}</p>
    </li>
  `;
  const commentList = post.querySelector('#comment-list');
  commentList.insertAdjacentHTML('beforeend', commentHTML);
}
//clear input form for user  to enter image or post details 
AddIt.addEventListener('click', () => {
  document.getElementById('title').value = '';
  document.getElementById('content').value = '';
  document.getElementById('imageFile').value = '';
  input.value = '';
  // Toggle the visibility of the form
  postInputForm.style.display = postInputForm.style.display === 'none' ? 'block' : 'none';
  //toggle the visibillity of addpost div 
  //AddIt.style.display = AddIt.style.display === 'none' ? 'block' : 'none';
});

// Add an array of predefined posts
// this is for inbuilt 5 posts
const inbuiltPosts = [
  {
    title: "Cryptography Service: A Complete Guide",
    content: "While promising to revolutionize multiple industries, quantum computers present potential threats to existing cryptographic systems.Post-quantum cryptography (PQC) is a field of study that tries to provide a solution for safeguarding our numeric world, where sensitive data is wholly encrypted and toughened in front of the integers of quantum machines. This ensures encryption stays secure as these advanced machines become more common and powerful. Such services are designed to protect information against quantum attacks by ensuring that your data will be safe when computing is quantum. But the right choice of such a service isn't easy. This guide will help you through the complexities of PQC and help you select a suitable service.",
    imageUrl: "https://1602894.fs1.hubspotusercontent-na1.net/hub/1602894/hubfs/102067022_m_normal_none%20%281%29.webp?width=900&name=102067022_m_normal_none%20%281%29.webp",
    date: "2024-13-09"
  },
  {
    title: "EU DORA Requirements for ICT Service Providers: All You Need to Know",
    content: "The Digital Operational Resilience Act (DORA) is a significant regulatory framework designed to ensure the operational resilience of financial services in the EU. One of the primary goals of DORA is to also harmonise security requirements in the European Union. A very critical component of this harmonisation is uniformity in the cybersecurity standards of third-party ICT (Information and Communications Technology) providers which the financial sector engages with. The EU DORA places heavy emphasis on the cyber competence of ICT Providers. These include providers of services such as cloud computing, data analytics, data centres and software. DORA has several stipulations which are meant to ensure that third-party providers have watertight cybersecurity measures in place. Players in the financial industry are also mandated to ensure their contracts with ICT providers are foolproof and keep them protected against any digital disasters on account of their supply chain. In this blog, we quickly go over the expectations from ICT service providers to financial players in the EU. It is worth noting that any ICT provider, based within or outside of the EU, falls under the ambit of the EU DORA if they do business with European entities. It is therefore imperative that you get ready for DORA compliance by January 2025 if you wish to continue your business relationship with EU partners. ICT service providers face intricate demands, especially those classified as 'critical ICT third-party providers' under the Act. Critical third-parties will be directly monitored by European Supervisory Authorities, as per DORA. Chapter V of the Final Text of the EU DORA regulation is specifically dedicated to ‘Managing of ICT Third-Party Risk’. It has specific prescriptions on how financial entities must choose their ICT third-party service providers and what the contractual agreements should look like. It also delves into the demonstration of cyber resilience that ICT third-party service providers must be capable of delivering. ",
    imageUrl: "https://1602894.fs1.hubspotusercontent-na1.net/hub/1602894/hubfs/114914682_m_normal_none%20%281%29.webp?width=900&name=114914682_m_normal_none%20%281%29.webp",
    date: "2024-12-09"
  },
  {
    title: "Optimizing Geotargeting and Localizing Content for Websites",
    content: "In the current digital landscape, businesses are increasingly recognizing the importance of geotargeting optimization and localizing content to effectively reach their target audience in specific geographic areas. By leveraging advanced technologies like a geolocation API, companies can tailor their online presence to resonate with local customers, ultimately driving higher engagement, conversions, and brand loyalty.",
    imageUrl: "https://1602894.fs1.hubspotusercontent-na1.net/hub/1602894/hubfs/92878147_m_normal_none%20%281%29.webp?width=900&name=92878147_m_normal_none%20%281%29.webp",
    date: "2024-11-09"
  },
  {
    title: "What is OSINT in Cyber Security?",
    content: "In today's world, where digital technologies cover almost all spheres of life, cyber security is becoming one of the most relevant and urgent topics for Internet users.    Each of us faces the issues of data protection, privacy and vulnerability in the virtual space in one way or another. Cyber threats can affect everyone, and their damage has no limits. The main types of online threats include:FraudViruses and Trojans (malware)Extortion through softwareDDoS attacks on serversTo protect yourself from potential attacks on personal/business information of the user, you should use proven methods of fighting hackers.",
    imageUrl: "https://1602894.fs1.hubspotusercontent-na1.net/hub/1602894/hubfs/150909067_m_normal_none%20%281%29.webp?width=900&name=150909067_m_normal_none%20%281%29.webp",
    date: "2024-10-09"
  },
  {
    title: "Why Strong Passwords Matter and How to Create Them",
    content: "TStrong passwords are vital for numerous reasons. Firstly, they help protect your personal and financial information from unauthorised access. In cases of attempted hacking, a strong password can slow down or frustrate the attacker, often leading them to move on to easier targets.Furthermore, in a corporate environment, securing employee accounts with strong passwords can prevent the spread of a breach across the network, safeguarding both proprietary information and customer data. For individuals and organisations alike, the repercussions of compromised passwords are severe, ranging from financial losses to reputational damage. As cyber security consultants in Australia often highlight, reinforcing password security is a critical step in forming a robust cyber defence strategy.",
    imageUrl: "https://1602894.fs1.hubspotusercontent-na1.net/hub/1602894/hubfs/108809004_m_normal_none%20%281%29.webp?width=900&name=108809004_m_normal_none%20%281%29.webp",
    date: "2024-06-09"
  }
];

// Create the in-built posts when the page loads
document.addEventListener('DOMContentLoaded', () => {
  inbuiltPosts.forEach((post) => {
    createPost(post.imageUrl, post.title, post.content, post.date);
    postInputForm.style.display = postInputForm.style.display === 'none' ? 'block' : 'none';
  });
});

