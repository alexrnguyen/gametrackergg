import { BarChart } from '@mui/x-charts/BarChart';

export default function RatingDistribution({ ratings }) {

    console.log(ratings);
    return (
        <>
            <BarChart 
                dataset={ratings}
                xAxis={[{ scaleType: 'band', dataKey: 'rating', data: ['½', '★', '★½', '★★', '★★½', '★★★', '★★★½', '★★★★', '★★★★½', '★★★★★'], tickLabelInterval: (_, index) => index === 0 || index === 9}]}
                yAxis={[{scaleType: undefined, disableLine: true, disableTicks: true, label: undefined}]}
                series={[{dataKey: 'numRatings'}]}
                width={300}
                height={150}
            />
        </>
    )
}