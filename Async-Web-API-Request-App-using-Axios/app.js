const form = document.querySelector('#form');

form.addEventListener('submit', async function(event) {
    event.preventDefault();
    const input = form.elements.query.value;
    
    if(input){
        try{
            const config = { params : { q: input } }
            const res = await axios.get(`http://api.tvmaze.com/search/shows`,config);
            if(!res.data.length){
                const h1 = document.createElement('H1');
                h1.innerText = 'No shows for your keyword';
                h1.setAttribute('id','warning')
                document.body.append(h1);
            } else {
                const warning = document.querySelector('#warning');
                if(warning){
                    document.body.removeChild(warning);
                }
            }

            const images = document.querySelectorAll('img');
                
            for(let image of images){
                document.body.removeChild(image);
            }

            displayImages(res.data);
            form.elements.query.value = '';
        }
        catch(error){
            console.log("ERROR",error);
        }
    }
});

const displayImages = data => {
    for(let result of data){
        if(result.show.image){
            const img = document.createElement('IMG');
            img.src = result.show.image.medium;
            document.body.append(img);
        }
    }
}