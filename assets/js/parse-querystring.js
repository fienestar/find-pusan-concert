/*
    URI의 쿼리스트링을 파싱합니다.
    단, 키가 중복인 경우에는 가장 마지막으로 오는 값이 저장됩니다.
*/
parsed_query_string = (function(){
    let url = window.location.href
    let qmark_index = url.indexOf('?')
    
    if(qmark_index == -1)
        return {}

    let data = {}

    url = url.substr(qmark_index + 1)

    for(pair of url.split('&')){
        let split = pair.split('=')

        data[split[0]] = split[1]
    }

    return data
})()