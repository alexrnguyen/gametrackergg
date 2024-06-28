import { BarChart } from '@mui/x-charts/BarChart';

export default function RatingDistribution({ ratings }) {

    console.log(ratings);
    return (
        <>
            <BarChart 
                dataset={ratings}
                xAxis={[{ scaleType: 'band', dataKey: 'rating', data: ['½', '★', '★½', '★★', '★★½', '★★★', '★★★½', '★★★★', '★★★★½', '★★★★★']}]}
                yAxis={[{scaleType: undefined, disableLine: true, disableTicks: true, label: undefined}]}
                series={[{dataKey: 'numRatings'}]}
                width={750}
                height={150}
            />
        </>
    )
}