/* ====== GitHub 版 ====== */
const owner = 'zuohenlin';   // 例：yangbushi
const repo  = 'exam-system';        // 仓库名

const token = localStorage.github_token;   // 后面登录存这里

/* 上传文件 */
async function uploadFile(path, content, message = 'upload'){
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const {data} = await axios.get(url,{headers:{Authorization:`token ${token}`}}).catch(()=>({data:{}}));
  const body = {
    message,
    content: btoa(unescape(encodeURIComponent(content))),
    sha: data.sha
  };
  return axios.put(url, body, {headers:{Authorization:`token ${token}`}});
}

/* 获取原始文本（报告） */
async function getText(path){
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`;
  const {data} = await axios.get(url,{params:{t:Date.now()}});
  return data;
}