const {createApp} = Vue;
createApp({
  data(){
    return {
      page:'login',
      questions:[
        {id:1,title:'两数之和',desc:'给出两个整数a、b，输出a+b',diff:'easy',lang:'python'}
      ],
      file:null,
      report:{}
    }
  },
  methods:{
    async login(){
      const pat = prompt('请输入 GitHub 私人令牌（勾选 repo）');
      if(!pat) return;
      localStorage.github_token = pat;
      this.page = 'list';
    },
    async upload(){
      if(!this.file){ alert('请先选择文件'); return; }
      const date = new Date().toISOString().slice(0,10);          // 2025-06-20
      const fname = this.file.name;                               // myadd.py
      const path  = `submissions/${date}/${fname}`;               // submissions/2025-06-20/myadd.py
      await uploadFile(path, await this.file.text());
      alert('已上传！等待评测...');
      this.pollReport(path.replace('.py','_report.json'));
    },
    async pollReport(rPath){
      for(let i=0;i<60;i++){                  // 最多等 2 分钟
        await new Promise(r=>setTimeout(r,2000));
        try{
          this.report = JSON.parse(await getText(rPath));
          return;
        }catch{/* 还没生成 */}
      }
      alert('评测超时，稍后再看');
    }
  },
  template:`
    <div class="wrap">
      <header>计协考核系统（GitHub 纯静态版）<button @click="page='login'">退出</button></header>
      <div v-if="page==='login'" class="login">
        <h2>登录</h2>
        <button @click="login">用 GitHub Token 登录</button>
      </div>
      <div v-if="page==='list'">
        <h3>题目列表</h3>
        <div class="qcard" v-for="q in questions" :key="q.id">
          <h4>{{q.title}} <span :class="q.diff">{{q.diff}}</span></h4>
          <p>{{q.desc}}</p>
        </div>
        <h3>提交答案</h3>
        <input type="file" @change="file=$event.target.files[0]" accept=".py">
        <button @click="upload">上传并测试</button>
        <div v-if="report.score!==undefined" class="result">
          得分：{{report.score}}<br>
          <div v-for="c in report.details" :class="c.passed?'pass':'fail'">
            {{c.case}}  {{c.passed?'✓':'✗'}}
          </div>
        </div>
      </div>
    </div>
  `
}).mount('#app');