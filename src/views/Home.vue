<template>
    <div class="home full-content scroll-content">
        <el-row>
            <h1 class="title">数据</h1>
        </el-row>
        <el-row :gutter="20">
            <el-col class="dash-count" :xs="24" :sm="12" :md="12" :lg="6" :xl="4">
                <div class="dash-num">50</div>
                <h3>缺陷总数</h3>
            </el-col>
            <el-col class="dash-count" :xs="24" :sm="12" :md="12" :lg="6" :xl="4">
                <div class="dash-num">18</div>
                <h3>待处理缺陷数</h3>
            </el-col>
            <el-col class="dash-count" :xs="24" :sm="12" :md="12" :lg="6" :xl="4">
                <el-progress type="dashboard" :percentage="percentage" :color="colors"></el-progress>
                <h3>缺陷完成率</h3>
            </el-col>
        </el-row>
        <el-row>
            <h1 class="title margin-top-4em">统计图</h1>
        </el-row>
        <el-row class="defect-count" ref="defectCount">
        </el-row>
    </div>
</template>

<script>
    import {
        Row,
        Col,
        Progress,
    } from 'element-ui'
    import * as Echarts from 'echarts'
    export default {
        name: 'Home',
        components: {
            'el-row': Row,
            'el-col': Col,
            'el-progress': Progress,
        },
        data() {
            return {
                percentage: 50,
                colors: [
                    {color: '#f56c6c', percentage: 20},
                    {color: '#e6a23c', percentage: 40},
                    {color: '#5cb87a', percentage: 60},
                    {color: '#1989fa', percentage: 80},
                    {color: '#6f7ad3', percentage: 100}
                ],
                defectCountConfig: [
                    {
                        key: '新增',
                        color: '#003366'
                    },
                    {
                        key: '已解决',
                        color: '#006699'
                    },
                    {
                        key: '待发布',
                        color: '#4cabce'
                    },
                    {
                        key: '已关闭',
                        color: '#e5323e'
                    },
                ]
            }
        },
        mounted () {
            this.initCharts();
        },
        methods: {
            initCharts() {
                this.$nextTick(() => {
                    const defectCount = Echarts.init(this.$refs.defectCount.$el);
                    const labelOption = {
                        show: true,
                        position: 'insideBottom',
                        distance: 15,
                        align: 'left',
                        verticalAlign: 'middle',
                        rotate: 90,
                        formatter: '{c}  {name|{a}}',
                        fontSize: 16,
                        rich: {
                            name: {
                                textBorderColor: '#fff'
                            }
                        }
                    };
                    const option = {
                        color: this.defectCountConfig.map(item => item.color),
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
                        },
                        legend: {
                            right: 0,
                            data: this.defectCountConfig.map(item => item.key),
                        },
                        toolbox: {
                            show: true,
                            orient: 'vertical',
                            left: 'left',
                            top: 'center',
                            feature: {
                                mark: {
                                    show: true,
                                    title: '保存为图片'
                                },
                                magicType: {
                                    show: true,
                                    type: ['line', 'bar', 'stack', 'tiled'],
                                    title: {
                                        line: '切换为折线图',
                                        bar: '切换为柱状图',
                                        stack: '切换为堆叠',
                                        tiled: '切换为平铺'
                                    }
                                },
                                restore: {
                                    show: true,
                                    title: '还原'
                                },
                                saveAsImage: {
                                    show: true,
                                    title: '保存为图片'
                                }
                            }
                        },
                        xAxis: [
                            {
                                type: 'category',
                                axisTick: {show: false},
                                data: ['2012', '2013', '2014', '2015', '2016']
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: [
                            {
                                name: '新增',
                                type: 'bar',
                                barGap: 0,
                                label: labelOption,
                                data: [320, 332, 301, 334, 390]
                            },
                            {
                                name: '已解决',
                                type: 'bar',
                                label: labelOption,
                                data: [220, 182, 191, 234, 290]
                            },
                            {
                                name: '待发布',
                                type: 'bar',
                                label: labelOption,
                                data: [150, 232, 201, 154, 190]
                            },
                            {
                                name: '已关闭',
                                type: 'bar',
                                label: labelOption,
                                data: [98, 77, 101, 99, 40]
                            }
                        ]
                    };
                    defectCount.setOption(option);
                });
            }
        }
    }
</script>

<style scoped>
    .home {
        padding: 1em;
        box-sizing: border-box;
    }
    .dash-count {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        cursor: pointer;
    }
    .dash-count .dash-num {
        height: 126px;
        width: 126px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 50px;
        font-weight: bold;
    }
    .defect-count {
        height: 500px;
    }
    .margin-top-4em {
        margin-top: 4em;
    }
    .title {
        font-weight: bold;
        font-size: 25px;
    }
</style>
