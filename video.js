// Function to format the time in hours, minutes, and seconds ago format
function setTimeString(time){
    const hour = parseInt(time / 3600); // Calculate hours
    let reminingSecond = time % 3600; // Remaining seconds after calculating hours
    const minute = parseInt(reminingSecond / 60); // Calculate minutes from remaining seconds
    reminingSecond = reminingSecond % 60; // Remaining seconds after calculating minutes
    // Return formatted string
    return `${hour} h ${minute} m ${reminingSecond} s ago`;
}


// remove active button function
const removeActiveClass = () =>{
    const Buttons = document.getElementsByClassName('category-btn')
    for(let btn of Buttons){
        btn.classList.remove('active')
    }
}

//video details with modal............
const loadDetails = async(videoId) =>{
    console.log(videoId)

    const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`
    const res = await fetch(url)
    const data = await res.json()
    displayDetails(data.video)
}

const displayDetails = (video) =>{
    console.log(video)
    const detailsContainer = document.getElementById('modal-content')
    detailsContainer.innerHTML = `
    <img src=${video.thumbnail} />
    <p>${video.description}</P>
    `
    //way 1
    // document.getElementById(showModalData).click()
    //way 2
    document.getElementById('customModal').showModal()

}

//search value .............................
document.getElementById('search-input').addEventListener('keyup', (e) =>{
    loadVideos(e.target.value)
})

// fetch,load and show categories on html 1st step strat
//  1 create loadCategories stat
const loadCategories= ()=>{
    fetch(' https://openapi.programming-hero.com/api/phero-tube/categories')
    .then(response => response.json())
    .then(data => displayCategories(data.categories))
    .catch(error => console.log(error))

}

//1 create display categories stat
const displayCategories = (categories) =>{
    const categoryContainer = document.getElementById('categories')
    categories.forEach(item => {
        // console.log(item)
// 3 create category button
        const buttonContainer = document.createElement('div')
        buttonContainer.innerHTML=`
        <button id="btn-${item.category_id}" class='btn category-btn' onclick="loadCategoryVideos(${item.category_id})">
        ${item.category}
        </button>
        `
        categoryContainer.append(buttonContainer)
        
    });
}
//1 create display categories end

//2ed step create load all video category and search text value ..
const loadVideos= (searchText = " ")=>{
    fetch(` https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    .then(response => response.json())
    .then(data => displayVideos(data.videos))
    .catch(error => console.log(error)) 
}

//2nd create display videos start

// 3 button a clk korle btn er video dehabe
const loadCategoryVideos = (id) =>{    
        fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
        .then(response => response.json())
        .then(data =>{
            //sobeike active class remove koro

            removeActiveClass()


            //sobaike active koro
            const activeButton = document.getElementById( `btn-${id}`)
            activeButton.classList.add('active')

            displayVideos(data.category)
        })
        .catch(error => console.log(error)) 
    
}
// sokol vedio ke display kora hoiche..................

const displayVideos = (videos) =>{
    const videoContainer = document.getElementById('videos')
    videoContainer.innerHTML=" ";


    // If no videos are found, display a message
    if(videos.length === 0) {
        videoContainer.classList.remove('grid'); // Remove grid layout
        videoContainer.innerHTML = `
        <div class="min-h-[300px] flex flex-col gap-5 justify-center items-center">
        <img src="img/icon.png" />
        <h2>No Content here in this Category</h2>
        </div>
        `;
    } else {
        videoContainer.classList.add('grid'); // Add grid layout if videos exist
    }



    videos.forEach((video => {
        // console.log(video)

        const card = document.createElement('div')
        card.classList = "card card-compact"
        card.innerHTML = `

        <figure class="h-[200px] relative">
    <img
      src=${video.thumbnail}
      class="h-full w-full object-cover"
      alt="Shoes" />
     ${video.others.posted_date?.length == 0 ? "" : `<span class="absolute right-2 bottom-2 bg-black text-white text-xs rounded p-1">${setTimeString(video.others.posted_date)}</span>`}
  </figure>
  <div class="px-0 py-2 flex gap-2">
  <div>
  <img class='w-10 h-10 rounded-full object-cover' src=${video.authors[0].profile_picture}/>
  </div>
  <div>
  <h2>${video.title}</h2>
  <div class='flex '>
    <p class='text-gray-400'>${video.authors[0].profile_name}</p>
   ${video.authors[0].verified == true ? `<img class='w-5 h-5 ml-2' src="img/verified.png"/>` : ""}
    </div>
    <button onclick="loadDetails('${video.video_id}')" class="btn btn-sm btn-error">Details</button>
  </div>
    
  </div>

        
        `;
        videoContainer.append(card)
    }))
}

//2nd create display videos end


loadCategories()
loadVideos()