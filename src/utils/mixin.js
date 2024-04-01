import { mapState } from "vuex";
export default {
    data() {
        return {
            name: 'mixin'
        }
    },
    created: function () {
        this.isLogin()
    },
    computed: {
        ...mapState(["userId"])
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
