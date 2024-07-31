const FormAutoFill = new Vue({
  el: '#app',
  data: {

    // Google Apps Script 部署為網路應用程式後的 URL
    gas: 'https://script.google.com/macros/s/AKfycby5wG8JeK1EHMcr15eu8IuplEyRAZFwHNNw8RLuOVv_G5syhFVvCu2Q-gamCGCf1Z2U/exec',

    id: '',

    // 避免重複 POST，存資料用的
    persons: {},

    // 頁面上吐資料的 data
    person: {},

    // Google Form 的 action URL
    formAction: 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSfBeHgMWa4XST5_RDlUW5yaLz3FB6FDKhRgI8xOJc-tVLhbgA/formResponse',
    
    // Google Form 各個 input 的 name
    input: {
      sn: 'entry.2044468000',
      group: 'entry.1791113497',
      company: 'entry.1303758949',
      product: 'entry.1205133388',
      msg: 'entry.1782841550'
    },

    // loading 效果要不要顯示
    loading: false
  },
  methods: {
    // ID 限填 4 碼
    limitIdLen(val) {
      if(val.length > 9) {
        return this.id =  this.id.slice(0, 9);
      }
    },
    // 送出表單
    submit() {
      // 再一次判斷是不是可以送出資料
      if(this.person.name !== undefined) {
        let params = `${this.input.sn}=${this.person.sn}&${this.input.group}=${this.person.group}&${this.input.company}=${this.person.company}&${this.input.product}=${this.person.product}&${this.input.msg}=${this.person.message || '無'}`;
        fetch(this.formAction + '?' + params, {
          method: 'POST'
        }).catch(err => {
            alert('提交成功。');
            this.id = '';
            this.person = {};
          })
      }
    }
  },
  watch: {
    id: function(val) {
      // ID 輸入到 4 碼就查詢資料
      if(val.length === 9) {

        // this.persons 裡沒這筆資料，才 POST
        if(this.persons[this.id] === undefined) {
          this.loading = true;
          let uri = this.gas + '?id=' + this.id;
          fetch(uri, {
            method: 'POST'
          }).then(res => res.json())
            .then(res => {
              this.persons[this.id] = res; // 把這次查詢的 id 結果存下來
              this.person = res;
              this.loading = false;
            })
        }
        // this.persons 裡有資料就吐資料
        else {
          this.person = this.persons[this.id];
        }

      }
    }
  }
})