import { Button } from "@mui/material";
import { Key } from "react"

interface Result {
    title: string;
    size: string;
    seeds: string;
    url: string;
}

interface ResultProps {
    data: Result[];
    download: (url: string) => void;
}

export default function Results(props: ResultProps) {
    const {data, download} = props;
    console.log(data);
    return (
        <div className="table">
    <table>
        <thead>
            <tr>
                <th>Title</th>
                <th>Size</th>
                <th>Seeds</th>
                <th>Select</th>
            </tr>
        </thead>
        <tbody>
            {data.map(
                (
                    val: { title: string; size: string; seeds: string; url: string },
                    key: Key | null | undefined
                ) => {
                    return (
                        <tr key={key}>
                            <td>{val.title}</td>
                            <td>{val.size}</td>
                            <td>{val.seeds}</td>
                            <td>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        console.log("would go to url", val.url);
                                        download(val.url);
                                    }}
                                >
                                    Download
                                </Button>
                            </td>
                        </tr>
                    );
                }
            )}
        </tbody>
    </table>
</div>

    )
}