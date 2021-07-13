status_box = (function(){
    let status_texts = ['검색하는 중', '검색하는 중.', '검색하는 중..', '검색하는 중...' ]
    let i = 0

    $(()=>{
        setInterval(()=>{
            let status_box = document.getElementById('status-box')
            i %= status_texts.length;
            status_box.innerHTML = status_texts[i];
            i += 1;
        },500)
    })

    function update()
    {
        status_box.innerHTML = status_texts[i = 0];
    }

    return {
        hide() {
            let status_box = document.getElementById('status-box')
            status_box.style.display = 'none'
        },
        show() {
            let status_box = document.getElementById('status-box')
            status_box.style.display = 'block'
        },
        setLoading() {
            let status_box = document.getElementById('status-box')
            status_texts = ['검색하는 중', '검색하는 중.', '검색하는 중..', '검색하는 중...' ];
            status_box.style.backgroundColor = 'rgb(228,228,228)'
            status_box.style.color = 'black'
            update()
        },
        setError() {
            let status_box = document.getElementById('status-box')
            status_texts = ['오류가 발생했어요']
            status_box.style.backgroundColor = 'red'
            status_box.style.color = 'white'
            update()
        },
        setNotFound() {
            let status_box = document.getElementById('status-box')
            status_texts = ['검색 결과가 없습니다.' ];
            status_box.style.backgroundColor = 'rgb(228,228,228)'
            status_box.style.color = 'black'
            update()
        }
    }
})()