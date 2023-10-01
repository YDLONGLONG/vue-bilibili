export default {
    data() {
        return {
            name: 'mixin'
        }
    },
    created: function () {
        this.isLogin()
    },
    methods: {
        isLogin: async () => {
            if (!this.userId) {
                this.$message.warning('请先登录')
                return await this.$router.push('/login')
            }
        }
    }
}
