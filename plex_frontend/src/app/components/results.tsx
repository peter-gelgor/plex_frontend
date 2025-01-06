import { Button } from "@mui/material";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react"

export default function Results(props: any) {
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