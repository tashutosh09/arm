export function getRuleStatusColor(status: string) {
    if (status) {
        switch (status.toUpperCase()) {
            case 'PENDING':
                return '#546E7A';

            case 'COMPLETED':
                return '#43A047';

            case 'RUNNING':
                return '#1E88E5';

            case 'FAILED':
                return '#e53935';

            default:
                return '#546E7A';
        }
    }
}
