concert_service = (function () {
    let concert_list_service_url = "http://localhost:3000/6260000/BusanCultureConcertService/getBusanCultureConcert"
    let concert_list_service_key = "VKkugSK8eGxlU9ZKN0ep31IO44bO5R7le5eYOZBQGI3HyzOaHSuWWxdGSNAwq%2BBQyJbNWs3c2oOlJP7YzEVqQQ%3D%3D"
    let concert_detail_service_url = "http://localhost:3000/6260000/BusanCultureConcertDetailService/getBusanCultureConcertDetail"
    let concert_detail_service_key = "VKkugSK8eGxlU9ZKN0ep31IO44bO5R7le5eYOZBQGI3HyzOaHSuWWxdGSNAwq%2BBQyJbNWs3c2oOlJP7YzEVqQQ%3D%3D"

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
        
        xhr.send();

        if(xhr.status != 200)
            return null
        else
            return new DOMParser().parseFromString(xhr.responseText, "text/xml")
    }

    function fill(obj1, obj2)
    {
        for(let i of Object.keys(obj2))
            if(obj1[i] === undefined)
                obj1[i] = obj2[i]
        
        return obj1
    }

    function today()
    {
        return new Date().toJSON().slice(0,10);
    }

    let error_count = 0

    return {
        getList(pageNo, numOfRows) {
            /*if(DEBUG_MODE)
                return JSON.parse(`... json`)
                    .slice(0,numOfRows)*/

            if(sessionStorage.getItem('concert-data')){
                let result = JSON.parse(sessionStorage.getItem('concert-data'))

                if(result.date == today())
                    return result.value
            }

            let xml = request(concert_list_service_url, { serviceKey: concert_list_service_key, pageNo, numOfRows })

            let items = get_children(xml,[0,1,0]).map(item=>{
                let result = {}
                let children = Array.from(item.children)

                for(child of children)
                    result[child.tagName] = child.textContent
                
                result.code = [pageNo, numOfRows, result.res_no];
                delete result.res_no

                return result;
            })

            sessionStorage.setItem(
                'concert-data',
                JSON.stringify({date: today(), value: items})
            )

            return items
        },

        makeDetail(data, callback) {
            setTimeout(()=>{
                if(data.detailed){
                    callback()
                    return data
                }

                if(data.element)
                    data.element_need_update = true

                let children;
                if(sessionStorage.getItem(data.code[2]))
                    children = JSON.parse(sessionStorage.getItem(data.code[2]))
                else{
                    let xml = request(concert_detail_service_url, { serviceKey: concert_detail_service_key, pageNo: data.code[0], numOfRows: data.code[1], res_no: data.code[2] })

                    if(xml.children[0].tagName == "OpenAPI_ServiceResponse" || xml.children[0].tagName == "result"){ // API 서버에서 오류 발생
                        error_count += 1
                        
                        if(error_count >= 15){
                            if(error_count == 15)
                                console.error("API서버에서 너무 많은 에러가 발생했어요.")
                            return;
                        }

                        return this.makeDetail(data, callback)
                    }
                    children = get_children(xml,[0,1,0,0]).map(child=>[child.tagName, child.textContent])

                    sessionStorage.setItem(data.code[2],JSON.stringify(children))
                }

                for(let child of children)
                    data[child[0]] = child[1]
                
                data.detailed = true;

                callback()
            },0)
        }
    }
})()