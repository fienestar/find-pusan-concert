weather_service = (function () {
    let weather_service_url = "https://www.weatheri.co.kr/forecast/forecast01.php?rid=1101010100&k=9&a_name=%EB%B6%80%EC%82%B0"

    function get_child(node, index_array)
    {
        for(let index of index_array)
            node = node.children[index]
        
        return node
    }

    function get_children(node, index_array)
    {
        return Array.from(get_child(node, index_array).children)
    }

    function request(url, param) {
        var xhr = new XMLHttpRequest();
        var param_str = '?' + Object.keys(param).map(v => encodeURIComponent(v) + '=' + param[v]).join('&')
        xhr.open('GET', url + param_str, false);
        
        xhr.send('');

        if(xhr.status != 200)
            return null
        else
            return new DOMParser().parseFromString(xhr.responseText, "text/xml")
    }

    return {
        get(date){

        }
    }
})()